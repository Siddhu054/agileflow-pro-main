import { TaskProvider } from "./context/TaskContext";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <TaskProvider>
      <div style={{ padding: 24 }}>
        <h1>AgileFlow Pro</h1>
        <TaskForm />
        <KanbanBoard />
        <TaskList />
      </div>
    </TaskProvider>
  );
}

export default App;
