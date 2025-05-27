import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import Home from "./Home";

function Dashboard() {
    const { user } = useUser();
    const { signOut } = useClerk();

    useEffect(() => {
        if (user?.id) {
            localStorage.setItem("clerkUserId", user.id);
            console.log("Stored Clerk User ID in localStorage:", user.id);

            const payload = {
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                name: user.fullName || "",
                imageUrl: user.imageUrl || "",
            };

            fetch("https://todo-js6q.onrender.com/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            })
                .then(async (res) => {
                    const data = await res.json();
                    console.log("Backend login response:", data);
                })
                .catch((err) => {
                    console.error("Login request failed:", err);
                });
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await fetch("https://todo-js6q.onrender.com/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            localStorage.removeItem("clerkUserId");
            console.log("Cleared localStorage and logged out from backend.");

            await signOut();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen p-4">
            {/* <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Welcome, {user.fullName || "User"}!</h1>
                    <p className="text-sm text-gray-600">Your Clerk ID: <code>{user.id}</code></p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div> */}

            <Home />
        </div>
    );
}

export default Dashboard;
