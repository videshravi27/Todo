import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const { user } = useUser();
  const [loginComplete, setLoginComplete] = useState(false);

  useEffect(() => {
    if (!user) return;

    const existingId = localStorage.getItem("clerkUserId");

    const performLogin = async () => {
      try {
        if (!existingId && user.id) {
          localStorage.setItem("clerkUserId", user.id);

          const payload = {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress || "",
            name: user.fullName || "",
            imageUrl: user.imageUrl || "",
          };

          const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
          });

          await res.json();
        }
      } catch (err) {
        console.error("Login request failed:", err);
      } finally {
        setLoginComplete(true);
      }
    };

    performLogin();
  }, [user]);

  return (
    <Router>
      <SignedIn>
        {loginComplete && <Navbar />}
      </SignedIn>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                {loginComplete ? <Dashboard /> : <p>Logging in...</p>}
              </SignedIn>
              <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                  <SignIn path="/" routing="path" />
                </div>
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;