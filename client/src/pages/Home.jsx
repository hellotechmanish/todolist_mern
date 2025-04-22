import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function Home() {
    const [userRole, setUserRole] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        fetch('http://localhost:5000/api/auth/', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                if (data.role) setUserRole(data.role);
                if (data.email) setUserEmail(data.email);
                console.log("Fetched Data: ", data);  // ADD THIS TO DEBUG
            })

            .catch(() => navigate('/login'));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">Welcome to Todo App 🎉</h1>
            <p className="text-lg">Your Email: <span className="font-semibold">{userEmail}</span></p>
            <p className="text-lg">You are logged in as: <span className="font-semibold">{userRole}</span></p>
            <Link
                to="/todo-dashboard"
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Go to Todo Dashboard
            </Link>
        </div>
    );

}

export default Home;
