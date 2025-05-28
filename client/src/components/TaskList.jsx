import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TaskList = ({ tasks, refreshTasks }) => {
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", dueDate: "" });

    const handleEditClick = (task) => {
        if (task.status === "Completed") return;
        setEditingTask(task._id);
        setFormData({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate?.slice(0, 10) || "",
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${BACKEND_URL}/tasks/${editingTask}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update task");

            setEditingTask(null);
            setFormData({ title: "", description: "", dueDate: "" });
            refreshTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) throw new Error("Failed to delete task");

            refreshTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusUpdate = async (taskId) => {
        try {
            const res = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: "Completed" }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            refreshTasks();
        } catch (err) {
            console.error(err);
        }
    };

    if (tasks.length === 0) return <p>No tasks found.</p>;

    return (
        <ul className="space-y-2">
            {tasks.map((task) => (
                <li
                    key={task._id}
                    className="bg-gray-100 p-3 rounded shadow flex justify-between items-start"
                >
                    {editingTask === task._id ? (
                        <form onSubmit={handleUpdate} className="flex-1 space-y-2">
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="block w-full p-2 border rounded"
                                placeholder="Task Title"
                                required
                            />
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="block w-full p-2 border rounded"
                                placeholder="Task Description"
                                required
                            />
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) =>
                                    setFormData({ ...formData, dueDate: e.target.value })
                                }
                                className="block w-full p-2 border rounded"
                                required
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingTask(null)}
                                    className="text-gray-600 hover:underline"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <strong>{task.title}</strong>
                                {task.status !== "Completed" && (
                                    <button onClick={() => handleStatusUpdate(task._id)} title="Mark as Completed">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                                            <path d="m9 11 3 3L22 4" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                            <p className="text-xs text-gray-500">
                                <span className="mr-2">
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`inline-block px-2 py-0.5 rounded text-white ${task.status === "Open" ? "bg-green-500" : "bg-gray-500"
                                            }`}
                                    >
                                        {task.status}
                                    </span>
                                </span>
                                <span className="mr-2">
                                    <strong>Due:</strong>{" "}
                                    {new Date(task.dueDate).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}                                </span>
                                <span>
                                    <strong>Created:</strong>{" "}
                                    {new Date(task.createdAt).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}                                </span>
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-2 ml-3 mt-1">
                        <button onClick={() => handleEditClick(task)} title="Edit">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                            </svg>
                        </button>

                        <button onClick={() => handleDelete(task._id)} title="Delete">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-red-600 hover:text-red-800"
                            >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default TaskList;