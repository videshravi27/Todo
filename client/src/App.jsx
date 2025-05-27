import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <SignedIn>
        <Navbar />
      </SignedIn>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Dashboard />
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