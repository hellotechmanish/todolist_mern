import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditTodoPage = () => {
    const { id } = useParams(); // Get the todo ID from the URL
    const [todo, setTodo] = useState({ title: '', description: '', dueDate: '', category: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Fetch the todo data for editing
        fetch(`http://localhost:5000/api/todos/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setError(data.message);
                } else {
                    setTodo(data); // Set the fetched todo data in the state
                }
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to fetch todo data.');
                setLoading(false);
            });
    }, [id, navigate]);

    // Handle form submission to update the todo
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        const { title, description, dueDate, category } = todo;

        fetch(`http://localhost:5000/api/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, description, dueDate, category }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setError(data.message);
                } else {
                    navigate('/todo-dashboard'); // Redirect to dashboard after successful update
                }
            })
            .catch((err) => {
                setError('Failed to update todo.');
            });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Todo</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={todo.title}  // Bind the title value from todo state
                            onChange={(e) => setTodo({ ...todo, title: e.target.value })}  // Update state on input change
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={todo.description}
                            onChange={(e) => setTodo({ ...todo, description: e.target.value })}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={todo.dueDate}
                            onChange={(e) => setTodo({ ...todo, dueDate: e.target.value })}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={todo.category}
                            onChange={(e) => setTodo({ ...todo, category: e.target.value })}
                            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Urgent">Urgent</option>
                            <option value="Non-Urgent">Non-Urgent</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTodoPage;
