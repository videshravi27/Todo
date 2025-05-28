"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { SignIn, SignedIn, SignedOut, useUser } from "@clerk/clerk-react"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import { Sparkles } from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function App() {
  const { user } = useUser()
  const [loginComplete, setLoginComplete] = useState(false)

  useEffect(() => {
    if (!user) return

    const existingId = localStorage.getItem("clerkUserId")

    const performLogin = async () => {
      try {
        if (!existingId && user.id) {
          localStorage.setItem("clerkUserId", user.id)

          const payload = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || "",
            imageUrl: user.imageUrl || "",
          }

          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          })

          if (!res.ok) {
            throw new Error(`Login failed with status ${res.status}`);
          }
          await res.json()
        }
        setLoginComplete(true);
      } catch (err) {
        console.error("Login request failed:", err);
        localStorage.removeItem("clerkUserId");
        setLoginComplete(false);
      }
    }

    performLogin()
  }, [user])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-cyan-50">
      <Router basename="/">
        <SignedIn>{loginComplete && <Navbar />}</SignedIn>

        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  {loginComplete ? (
                    <Home />
                  ) : (
                    <div className="min-h-screen flex items-center justify-center">
                      <div className="text-center space-y-6">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                            <Sparkles className="h-12 w-12 text-white animate-pulse" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-bounce"></div>
                        </div>
                        <div className="space-y-3">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            Setting up your workspace
                          </h2>
                          <p className="text-slate-600">Just a moment while we prepare everything for you...</p>
                          <div className="flex justify-center">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </SignedIn>
                <SignedOut>
                  <div className="min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                      <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                              <Sparkles className="h-10 w-10 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full"></div>
                          </div>
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                          TaskFlow
                        </h1>
                        <p className="text-slate-600 text-lg">
                          Transform your productivity with beautiful task management
                        </p>
                      </div>
                      <SignIn path="/" routing="path" />
                    </div>
                  </div>
                </SignedOut>
              </>
            }
          />
          <Route path="/sso-callback" element={<Navigate to="/" replace />} />
          <Route path="//sso-callback" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App