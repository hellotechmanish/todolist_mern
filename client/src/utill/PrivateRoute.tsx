import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

type JwtPayload = {
    exp: number;
} & Record<string, unknown>;

const parseJwt = (token: string): JwtPayload | null => {
    try {
        const base64 = token.split('.')[1];
        const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(json) as JwtPayload;
    } catch {
        return null;
    }
};

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
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
