import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface UserResponse {
    role: string;
    email: string;
}

export default function Home() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        fetch("http://localhost:5000/api/auth/", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data: UserResponse) => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => navigate("/login"));
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white w-full max-w-md rounded-lg shadow p-6">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
                    Welcome
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    You are logged in to your Todo App
                </p>

                <div className="bg-gray-50 border rounded-lg p-4 mb-6">
                    <p className="text-gray-700">
                        <span className="font-medium">Email:</span> {user?.email}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-medium">Role:</span>{" "}
                        <span className="capitalize">{user?.role}</span>
                    </p>
                </div>

                <Link
                    to="/todo-dashboard"
                    className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
}
