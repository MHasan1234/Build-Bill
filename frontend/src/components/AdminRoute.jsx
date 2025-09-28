import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, token } = useAuth();


    if (!token) {
        return <Navigate to="/login" replace />;
    }

    
    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    
    return children;
}