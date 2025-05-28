"use client"

import { useEffect, useState } from "react"
import TaskList from "./TaskList"
import TaskFormModal from "./TaskFormModal"
import { Plus, Sparkles, CheckCircle2, Clock, TrendingUp } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddTask, setShowAddTask] = useState(false)
  const [formData, setFormData] = useState({ title: "", description: "", dueDate: "" })
  const [posting, setPosting] = useState(false)

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/tasks/`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to fetch tasks")
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error(err)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAddTask = async (e) => {
    e.preventDefault()
    setPosting(true)

    try {
      const res = await fetch(`${BACKEND_URL}/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to add task")

      const newTask = await res.json()
      setTasks([newTask, ...tasks])
      setShowAddTask(false)
      setFormData({ title: "", description: "", dueDate: "" })
    } catch (err) {
      console.error("Error adding task:", err)
    } finally {
      setPosting(false)
    }
  }

  const completedTasks = tasks.filter((task) => task.status === "Completed")
  const openTasks = tasks.filter((task) => task.status === "Open")
  const todayTasks = openTasks.filter(task => {
    const today = new Date().toDateString()
    return new Date(task.dueDate).toDateString() === today
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                      Task Manager
                    </h1>
                    <p className="text-slate-600 text-lg mt-1">Organize your day, achieve your goals</p>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl border border-emerald-200/50">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                      <div>
                        <p className="text-2xl font-bold text-emerald-700">{completedTasks.length}</p>
                        <p className="text-sm text-emerald-600">Completed</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-700">{todayTasks.length}</p>
                        <p className="text-sm text-blue-600">Due Today</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-2xl border border-violet-200/50">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-6 w-6 text-violet-600" />
                      <div>
                        <p className="text-2xl font-bold text-violet-700">{openTasks.length}</p>
                        <p className="text-sm text-violet-600">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setFormData({ title: "", description: "", dueDate: "" })
                    setShowAddTask(true)
                  }}
                  className="group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
                >
                  <Plus className="h-6 w-6 group-hover:rotate-180 transition-transform duration-300" />
                  Create New Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-violet-600 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <TaskList tasks={tasks} refreshTasks={fetchTasks} />
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => {
            setFormData({ title: "", description: "", dueDate: "" })
            setShowAddTask(true)
          }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center lg:hidden z-50"
        >
          <Plus className="h-8 w-8" />
        </button>

        {/* Modal */}
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
    </div>
  )
}

export default Home