import { useEffect, useState } from 'react';
import TodoCard from '../component/TodoCard';
import { useNavigate } from 'react-router-dom';

const TodoDashboardPage = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        fetch('http://localhost:5000/api/todos', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                setTodos(data.todos);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch todos.');
                setLoading(false);
            });
    }, []);

    // Handle Todo Delete
    const handleDelete = (todoId) => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        fetch(`http://localhost:5000/api/todos/${todoId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message === 'Todo deleted successfully') {
                    // Filter out the deleted todo from the state
                    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
                } else {
                    setError('Failed to delete todo');
                }
            })
            .catch((err) => {
                setError('Failed to delete todo');
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">📋 Todo Dashboard</h1>
                    <button
                        onClick={() => navigate('/create-todo')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
                    >
                        ➕ Create Todo
                    </button>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading todos...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : todos.length === 0 ? (
                    <p className="text-center text-gray-500">No todos found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {todos.map((todo) => (
                            <TodoCard
                                key={todo._id}
                                todo={todo}
                                onEdit={() => navigate(`/edit-todo/${todo._id}`)} // Edit handler
                                onDelete={() => handleDelete(todo._id)} // Delete handler
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoDashboardPage;
