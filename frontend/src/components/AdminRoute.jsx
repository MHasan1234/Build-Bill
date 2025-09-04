import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, token } = useAuth();

    // If there's no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If the user is not an admin, redirect to their regular dashboard
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // If the user is an admin, show the content
    return children;
}