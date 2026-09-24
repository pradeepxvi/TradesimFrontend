import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../utils/session";

const ProtectedRoutes = () => {
    if (!getStoredUser()) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoutes;
