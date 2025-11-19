import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoCard from "../component/TodoCard";
import type { Todo } from "../types/todo";

interface TodoListResponse {
    todos: Todo[];
    message?: string;
}

export default function TodoDashboardPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        fetch("http://localhost:5000/api/todos", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data: TodoListResponse) => {
                setTodos(data.todos ?? []);
                setLoading(false);
            })
            .catch(() => {
                setError("Unable to load todos.");
                setLoading(false);
            });
    }, [navigate]);

    const handleDelete = (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === "Todo deleted successfully") {
                    setTodos((prev) => prev.filter((item) => item._id !== id));
                } else {
                    setError("Unable to delete todo.");
                }
            })
            .catch(() => setError("Unable to delete todo."));
    };

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Todo Dashboard</h1>

                    <button
                        onClick={() => navigate("/create-todo")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Create Todo
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {loading && (
                    <p className="text-center text-gray-600">Loading...</p>
                )}

                {!loading && todos.length === 0 && (
                    <p className="text-center text-gray-600 mt-10">
                        No todos available. Create one to get started.
                    </p>
                )}

                {!loading && todos.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {todos.map((todo) => (
                            <TodoCard
                                key={todo._id}
                                todo={todo}
                                onEdit={() => navigate(`/edit-todo/${todo._id}`)}
                                onDelete={() => handleDelete(todo._id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
