"use client"

import { useState } from "react"
import { Edit3, Trash2, CheckCircle2, Calendar, Clock, Save, X, AlertCircle, Star } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const TaskList = ({ tasks, refreshTasks }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "" })

  const handleEditClick = (task) => {
    if (task.status === "Completed") return
    setEditingTask(task._id)
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 10) || "",
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${editingTask}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update task")

      setEditingTask(null)
      setFormData({ title: "", description: "", dueDate: "" })
      refreshTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (taskId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to delete task")

      refreshTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const handleStatusUpdate = async (taskId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "Completed" }),
      })

      if (!res.ok) throw new Error("Failed to update status")

      refreshTasks()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString()
  }

  const isToday = (dueDate) => {
    return new Date(dueDate).toDateString() === new Date().toDateString()
  }

  const getDueDateColor = (dueDate, status) => {
    if (status === "Completed") return "text-emerald-600"
    if (isOverdue(dueDate)) return "text-red-500 font-semibold"
    if (isToday(dueDate)) return "text-amber-600 font-semibold"
    return "text-slate-600"
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full flex items-center justify-center">
            <Star className="h-16 w-16 text-violet-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-700 mb-3">Ready to get started?</h3>
        <p className="text-slate-500 text-lg max-w-md">Create your first task and begin your journey to productivity!</p>
      </div>
    )
  }

  const openTasks = tasks.filter(task => task.status === "Open")
  const completedTasks = tasks.filter(task => task.status === "Completed")

  return (
    <div className="space-y-8">
      {/* Open Tasks */}
      {openTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800">Active Tasks</h2>
            <div className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold">
              {openTasks.length}
            </div>
          </div>
          <div className="grid gap-4">
            {openTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                editingTask={editingTask}
                formData={formData}
                setFormData={setFormData}
                handleEditClick={handleEditClick}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                handleStatusUpdate={handleStatusUpdate}
                setEditingTask={setEditingTask}
                formatDate={formatDate}
                getDueDateColor={getDueDateColor}
                isOverdue={isOverdue}
                isToday={isToday}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-slate-800">Completed</h2>
            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
              {completedTasks.length}
            </div>
          </div>
          <div className="grid gap-4">
            {completedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                editingTask={editingTask}
                formData={formData}
                setFormData={setFormData}
                handleEditClick={handleEditClick}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                handleStatusUpdate={handleStatusUpdate}
                setEditingTask={setEditingTask}
                formatDate={formatDate}
                getDueDateColor={getDueDateColor}
                isOverdue={isOverdue}
                isToday={isToday}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const TaskCard = ({
  task,
  editingTask,
  formData,
  setFormData,
  handleEditClick,
  handleUpdate,
  handleDelete,
  handleStatusUpdate,
  setEditingTask,
  formatDate,
  getDueDateColor,
  isOverdue,
  isToday
}) => {
  return (
    <div className={`group relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ${task.status === "Completed" ? "opacity-75" : "hover:scale-[1.02]"
      }`}>
      <div className="p-6">
        {editingTask === task._id ? (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
              <input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                placeholder="Task Title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Task Description"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Update Task
              </button>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className={`text-xl font-bold ${task.status === "Completed"
                      ? "line-through text-slate-500"
                      : "text-slate-800"
                    }`}>
                    {task.title}
                  </h3>
                  {task.status !== "Completed" && (
                    <button
                      onClick={() => handleStatusUpdate(task._id)}
                      className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-200 transform hover:scale-110"
                      title="Mark as Completed"
                    >
                      <CheckCircle2 className="h-6 w-6" />
                    </button>
                  )}
                  {isOverdue(task.dueDate) && task.status !== "Completed" && (
                    <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Overdue
                    </div>
                  )}
                  {isToday(task.dueDate) && task.status !== "Completed" && (
                    <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">
                      Due Today
                    </div>
                  )}
                </div>

                <p className={`text-base leading-relaxed ${task.status === "Completed" ? "text-slate-400" : "text-slate-600"
                  }`}>
                  {task.description}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "Open"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                      }`}>
                      {task.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className={getDueDateColor(task.dueDate, task.status)}>
                      Due: {formatDate(task.dueDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-500">
                      Created: {formatDate(task.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEditClick(task)}
                  className="p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-200 transform hover:scale-110"
                  title="Edit Task"
                  disabled={task.status === "Completed"}
                >
                  <Edit3 className="h-5 w-5" />
                </button>

                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110"
                  title="Delete Task"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList 