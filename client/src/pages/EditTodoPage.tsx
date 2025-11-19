import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { TodoCategory } from "../types/todo";

interface EditableTodo {
    title: string;
    description: string;
    dueDate: string;
    category: TodoCategory | "";
}

const initialTodo: EditableTodo = {
    title: "",
    description: "",
    dueDate: "",
    category: "",
};

export default function EditTodoPage() {
    const { id } = useParams<{ id: string }>();
    const [todo, setTodo] = useState<EditableTodo>(initialTodo);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        fetch(`http://localhost:5000/api/todos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data: EditableTodo & { message?: string }) => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setTodo({
                        title: data.title,
                        description: data.description,
                        dueDate: data.dueDate?.slice(0, 10) ?? "",
                        category: data.category,
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Unable to load todo.");
                setLoading(false);
            });
    }, [id, navigate]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(todo),
        })
            .then((res) => res.json())
            .then((data: { message?: string }) => {
                if (!data.message) navigate("/todo-dashboard");
                else setError(data.message);
            })
            .catch(() => setError("Unable to update todo."));
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setTodo((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-10">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-semibold text-gray-800">Edit Todo</h1>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
                    >
                        Back
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-lg shadow"
                >
                    <div className="mb-5">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            value={todo.title}
                            onChange={handleChange}
                            type="text"
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={todo.description}
                            onChange={handleChange}
                            rows={4}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={todo.dueDate}
                            onChange={handleChange}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={todo.category}
                            onChange={handleChange}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Non-Urgent">Non-Urgent</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
