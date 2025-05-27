import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useClerk } from "@clerk/clerk-react";

function Navbar() {
    const [name, setName] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useClerk();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const res = await fetch("http://localhost:4000/auth/details", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Failed to fetch user details");

                const data = await res.json();
                // console.log("User details:", data);
                setName(data[0]?.name);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setName("User");
            }
        };

        fetchUserDetails();
    }, [location]);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:4000/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Backend logout failed");
            localStorage.clear();
            await signOut();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/login");
        }
    };

    if (location.pathname === "/login") return null;

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                MyApp
            </Link>
            <div className="flex items-center gap-4">
                <span>Hi, {name}</span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;