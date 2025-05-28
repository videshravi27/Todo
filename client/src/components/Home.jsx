import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskFormModal from "./TaskFormModal";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [posting, setPosting] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    setPosting(true);

    try {
      const res = await fetch(`${BACKEND_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add task");

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setShowAddTask(false);
      setFormData({ title: "", description: "" });
    } catch (err) {
      console.error("Error adding task:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="relative p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
      {loading ? <p>Loading tasks...</p> : <TaskList tasks={tasks} refreshTasks={fetchTasks} />}

      <button
        onClick={() => {
          setFormData({ title: "", description: "" });
          setShowAddTask(true);
        }}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
        aria-label="Add Task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>

      {showAddTask && (
        <TaskFormModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowAddTask(false)}
          onSubmit={handleAddTask}
          submitting={posting}
          mode="Add"
        />
      )}
    </div>
  );
};

export default Home;