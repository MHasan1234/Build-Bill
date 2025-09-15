import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountantRoute({ children }) {
    const { user, token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Allow access if the user is an accountant OR an admin
    if (user?.role !== 'accountant' && user?.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
