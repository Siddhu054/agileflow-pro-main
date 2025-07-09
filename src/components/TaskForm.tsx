import React, { useState, useContext } from "react";
import type { Task, TaskPriority, TaskStatus } from "../types/task";
import { TaskContext } from "../context/TaskContext";

const statusOptions: TaskStatus[] = ["todo", "in-progress", "done"];
const priorityOptions: TaskPriority[] = ["low", "medium", "high"];

const initialForm = {
  title: "",
  assignee: "",
  status: "todo" as TaskStatus,
  description: "",
  priority: "medium" as TaskPriority,
  dueDate: "",
  tags: [] as string[],
};

export default function TaskForm() {
  const { dispatch } = useContext(TaskContext)!;
  const [form, setForm] = useState(initialForm);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddTag = () => {
    if (tagInput && !form.tags.includes(tagInput)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tagInput] }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const validate = () => {
    if (!form.title.trim() || !form.assignee.trim()) {
      return "Title and Assignee are required.";
    }
    if (form.title.length > 100 || form.assignee.length > 100) {
      return "Title and Assignee must be under 100 characters.";
    }
    if (!form.dueDate || new Date(form.dueDate) <= new Date()) {
      return "Due date must be a future date.";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    try {
      // API expects: { todo: string, completed: boolean, userId: number }
      const response = await fetch("https://dummyjson.com/todos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todo: form.title,
          completed: form.status === "done",
          userId: 1, // Simulate user
        }),
      });
      if (!response.ok) throw new Error("Failed to add task to API");
      const data = await response.json();
      // Map API response to our Task type
      const newTask: Task = {
        id: data.id || Date.now(),
        title: data.todo || form.title,
        assignee: form.assignee,
        status: data.completed ? "done" : form.status,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate,
        tags: form.tags,
      };
      dispatch({ type: "ADD_TASK", payload: newTask });
      setForm(initialForm);
      setSuccess("Task added successfully!");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: 24,
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 8,
      }}
    >
      <h2>Add New Task</h2>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginBottom: 8 }}>{success}</div>
      )}
      <div>
        <label>
          Title*
          <br />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
            required
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Assignee*
          <br />
          <input
            name="assignee"
            value={form.assignee}
            onChange={handleChange}
            maxLength={100}
            required
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Status
          <br />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={loading}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Priority
          <br />
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            disabled={loading}
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Due Date*
          <br />
          <input
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Description
          <br />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </label>
      </div>
      <div>
        <label>
          Tags
          <br />
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag"
            disabled={loading}
          />
          <button type="button" onClick={handleAddTag} disabled={loading}>
            Add Tag
          </button>
        </label>
        <div>
          {form.tags.map((tag) => (
            <span key={tag} style={{ marginRight: 8 }}>
              {tag}{" "}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                disabled={loading}
              >
                x
              </button>
            </span>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
