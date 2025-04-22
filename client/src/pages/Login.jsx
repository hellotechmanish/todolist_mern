import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ emailOrUsername: '', password: '' }); // fix key name
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // Payload matches backend expectation
            const payload = {
                emailOrUsername: formData.emailOrUsername,
                password: formData.password
            };

            console.log('Login Payload:', payload);

            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            console.log('Login Response:', data);

            if (!res.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            // Save token and role
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);

            // Redirect based on role
            if (data.role === 'admin') navigate('/admin');
            // else navigate('/todo-dashboard');
            else navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="emailOrUsername"
                        placeholder="Email or Username"
                        value={formData.emailOrUsername}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </form>

                <p className="text-sm text-center mt-4">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
export default Login;
