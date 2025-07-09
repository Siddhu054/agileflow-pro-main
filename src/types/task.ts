export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  assignee: string;
  status: TaskStatus;
  description?: string;
  priority: TaskPriority;
  dueDate: string; // ISO string
  tags?: string[];
}
