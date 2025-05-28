"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClerk } from "@clerk/clerk-react"
import { LogOut, Sparkles, User, CheckSquare } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function Navbar() {
  const [name, setName] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useClerk()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/details`, {
          method: "GET",
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch user details")

        const data = await res.json()
        setName(data[0]?.name)
      } catch (error) {
        console.error("Error fetching user details:", error)
        setName("User")
      }
    }

    fetchUserDetails()
  }, [location])

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Backend logout failed")
      localStorage.removeItem("clerkUserId")
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error)
      navigate("/")
    }
  }

  if (location.pathname === "/login") return null

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="p-2 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200">
                <CheckSquare className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className="text-xs text-slate-500 -mt-1">Stay Organized</p>
            </div>
          </Link>

          {/* User Section */}
          <div className="flex items-center gap-6">
            {/* Welcome Message */}
            <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-violet-50 to-indigo-50 px-4 py-2 rounded-2xl border border-violet-200/50">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-row gap-1.5">
                <p className="text-sm font-semibold text-slate-700">Welcome back, </p>
                <p className="text-sm text-violet-600 font-bold">{name || "User"}</p>
              </div>
            </div>

            {/* Mobile Welcome */}
            <div className="md:hidden flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700">{name || "User"}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-red-50 hover:to-red-100 px-4 py-3 rounded-xl border border-slate-200 hover:border-red-200 transition-all duration-200 text-slate-700 hover:text-red-600"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar