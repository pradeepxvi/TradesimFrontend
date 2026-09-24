import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { getStoredUser } from "../utils/session";

const ProtectedRoutes = () => {
    const authenticated = Boolean(getStoredUser());

    useEffect(() => {
        if (!authenticated) {
            localStorage.clear();
            toast.info("You need to be authenticated to access that page.");
        }
    }, [authenticated]);

    if (!authenticated) return <Navigate to="/login" replace />;

    return <Outlet />;
};

export default ProtectedRoutes;
