// src/utill/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

function parseJwt(token) {
    try {
        const base64 = token.split('.')[1];                 // payload
        const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) return <Navigate to="/login" replace />;

    const decoded = parseJwt(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
