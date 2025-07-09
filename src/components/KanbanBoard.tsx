// @ts-ignore
import React, { useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TaskContext } from "../context/TaskContext";
import type { Task, TaskStatus } from "../types/task";

const statusColumns: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To Do" },
  { key: "in-progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

function groupTasksByStatus(tasks: Task[]) {
  return statusColumns.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);
}

export default function KanbanBoard() {
  const { state, dispatch } = useContext(TaskContext)!;
  const grouped = groupTasksByStatus(state.tasks);

  const onDragEnd = (result: any) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    const taskId = Number(draggableId);
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;
    const newStatus = destination.droppableId as TaskStatus;
    dispatch({ type: "UPDATE_TASK", payload: { ...task, status: newStatus } });
  };

  return (
    <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {statusColumns.map((col) => (
          <Droppable droppableId={col.key} key={col.key}>
            {(provided: any, snapshot: any) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  background: snapshot.isDraggingOver ? "#e0e0e0" : "#222",
                  padding: 12,
                  borderRadius: 8,
                  minWidth: 250,
                  minHeight: 400,
                  flex: 1,
                }}
              >
                <h3>{col.label}</h3>
                {grouped[col.key].map((task, idx) => (
                  <Draggable
                    draggableId={task.id.toString()}
                    index={idx}
                    key={task.id}
                  >
                    {(provided: any, snapshot: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          margin: "0 0 8px 0",
                          padding: 12,
                          borderRadius: 6,
                          background: snapshot.isDragging ? "#444" : "#333",
                          color: "#fff",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <strong>{task.title}</strong>
                        <div>Assignee: {task.assignee}</div>
                        <div>Due: {task.dueDate.slice(0, 10)}</div>
                        <div>Priority: {task.priority}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
