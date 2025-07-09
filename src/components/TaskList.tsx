import React, { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { FixedSizeList as List } from "react-window";

function isWithinRange(date: string, start: string, end: string) {
  if (!start && !end) return true;
  const d = new Date(date);
  if (start && d < new Date(start)) return false;
  if (end && d > new Date(end)) return false;
  return true;
}

export default function TaskList() {
  const { state } = useContext(TaskContext)!;
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filtered = state.tasks.filter((task) => {
    const matchesPriority = priority ? task.priority === priority : true;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase());
    const matchesDate = isWithinRange(task.dueDate, startDate, endDate);
    return matchesPriority && matchesSearch && matchesDate;
  });

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const task = filtered[index];
    return (
      <li
        style={{
          ...style,
          marginBottom: 8,
          border: "1px solid #eee",
          padding: 8,
          borderRadius: 4,
        }}
      >
        <strong>{task.title}</strong> (Assignee: {task.assignee})<br />
        Status: {task.status} | Priority: {task.priority} | Due:{" "}
        {task.dueDate.slice(0, 10)}
        <br />
        {task.tags && task.tags.length > 0 && (
          <span>Tags: {task.tags.join(", ")}</span>
        )}
        <br />
        <span style={{ color: "#888" }}>{task.description}</span>
      </li>
    );
  };

  return (
    <div>
      <h2>Task List</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Priority Filter: </label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          style={{ marginLeft: 16 }}
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span style={{ marginLeft: 16 }}>
          Due Date Range:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: 4 }}
          />
          -
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: 4 }}
          />
        </span>
      </div>
      <ul style={{ padding: 0, listStyle: "none" }}>
        <List
          height={Math.min(400, filtered.length * 90)}
          itemCount={filtered.length}
          itemSize={90}
          width={"100%"}
        >
          {Row}
        </List>
      </ul>
    </div>
  );
}
