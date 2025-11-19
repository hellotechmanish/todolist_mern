import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white py-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Todo App</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:text-gray-200">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/create-todo" className="hover:text-gray-200">Create Todo</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
