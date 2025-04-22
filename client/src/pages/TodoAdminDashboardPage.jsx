// frontend/src/pages/TodoAdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TodoAdminDashboardPage = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editTodo, setEditTodo] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        title: '',
        description: '',
        dueDate: '',
        category: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        // Fetch all todos for admin (from the backend)
        fetch('http://localhost:5000/api/admin/todos', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.todos) {
                    setTodos(data.todos);
                    setLoading(false);
                } else {
                    setError('Failed to fetch todos.');
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError('Failed to fetch todos.');
                setLoading(false);
            });
    }, [navigate]);

    const handleEditClick = (todo) => {
        // Open the edit form with the current todo data
        setEditTodo(todo);
        setUpdatedData({
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            category: todo.category,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEdit = (id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/admin/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedData),
        })
            .then((res) => res.json())
            .then((data) => {
                const updatedTodos = todos.map((todo) =>
                    todo._id === id ? data : todo
                );
                setTodos(updatedTodos);
                setEditTodo(null); // Close the edit form
            })
            .catch((err) => setError('Failed to update todo.'));
    };

    const handleCancelEdit = () => {
        setEditTodo(null); // Close the edit form
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:5000/api/admin/todos/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Todo deleted successfully') {
                    // Remove the deleted todo from the state
                    const updatedTodos = todos.filter((todo) => todo._id !== id);
                    setTodos(updatedTodos);
                } else {
                    setError('Failed to delete todo.');
                }
            })
            .catch((err) => setError('Failed to delete todo.'));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Todo Dashboard</h1>
                {error && <p className="text-red-500">{error}</p>}
                {loading ? (
                    <p className="text-center text-gray-500">Loading todos...</p>
                ) : todos.length === 0 ? (
                    <p className="text-center text-gray-500">No todos found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {todos.map((todo) => (
                            <div key={todo._id} className="bg-white p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold">{todo.title}</h2>
                                <p>{todo.description}</p>
                                <p className="text-sm text-gray-500">Due: {todo.dueDate}</p>
                                <p className="text-sm text-gray-500">Category: {todo.category}</p>

                                {/* Edit Button */}
                                <button
                                    onClick={() => handleEditClick(todo)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                >
                                    Edit
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(todo._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Form Modal */}
                {editTodo && (
                    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
                            <input
                                type="text"
                                name="title"
                                value={updatedData.title}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                                placeholder="Title"
                            />
                            <input
                                type="text"
                                name="description"
                                value={updatedData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                                placeholder="Description"
                            />
                            <input
                                type="date"
                                name="dueDate"
                                value={updatedData.dueDate}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                name="category"
                                value={updatedData.category}
                                onChange={handleInputChange}
                                className="w-full p-2 mb-2 border border-gray-300 rounded"
                                placeholder="Category"
                            />
                            <div className="flex justify-end">
                                <button
                                    onClick={() => handleEdit(editTodo._id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoAdminDashboardPage;
