import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PremiumRoute() {
    const { user } = useAuth();
    if (user.role !== "premium" && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}