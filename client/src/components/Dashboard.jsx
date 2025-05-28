import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import Home from "./Home";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Dashboard() {
    const { user } = useUser();
    const { signOut } = useClerk();

    useEffect(() => {
        if (!user) return; 

        const existingId = localStorage.getItem("clerkUserId");

        if (!existingId && user.id) {
            localStorage.setItem("clerkUserId", user.id);
            console.log("Stored Clerk User ID in localStorage:", user.id);

            const payload = {
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || "",
                name: user.fullName || "",
                imageUrl: user.imageUrl || "",
            };

            fetch(`${BACKEND_URL}/auth/login`, {
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
            await fetch(`${BACKEND_URL}/auth/logout`, {
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
            <Home />
        </div>
    );
}

export default Dashboard;
