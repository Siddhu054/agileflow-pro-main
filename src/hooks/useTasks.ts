import { useCallback, useEffect, useState } from "react";
import type { Task } from "../types/task";

const API_URL = "https://dummyjson.com/todos";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      // Map API data to our Task type (add missing fields as needed)
      const mapped: Task[] = data.todos.map((t: any) => ({
        id: t.id,
        title: t.todo,
        assignee: t.userId ? `User ${t.userId}` : "Unassigned",
        status: t.completed ? "done" : "todo",
        description: "",
        priority: "medium",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: [],
      }));
      setTasks(mapped);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, refetch: fetchTasks };
}
