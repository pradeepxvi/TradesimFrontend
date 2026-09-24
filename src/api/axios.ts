import axios from "axios";
import { getStoredUser } from "../utils/session";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
    },
});

api.interceptors.request.use((config) => {
    const user = getStoredUser();
    if (user?.access) {
        config.headers.Authorization = `Bearer ${user.access}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (!axios.isAxiosError(error) || !error.response) {
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest?._retry) {
            const user = getStoredUser();
            if (!user?.refresh) {
                localStorage.removeItem("user");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }

            try {
                originalRequest._retry = true;
                const response = await api.post("/auth/token/refresh/", {
                    refresh: user.refresh,
                });

                const nextAccess = response.data?.access;
                if (!nextAccess) {
                    throw new Error("Missing refreshed token");
                }

                const updatedUser = { ...user, access: nextAccess };
                localStorage.setItem("user", JSON.stringify(updatedUser));

                originalRequest.headers.Authorization = `Bearer ${nextAccess}`;
                return api(originalRequest);
            } catch {
                localStorage.removeItem("user");
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export default api;

// baseURL: "https://tb.pradipkunwar.name.np/api/v1",
// baseURL: "https://tradesimbackend.onrender.com/api/v1",
// baseURL: "http://127.0.0.1:8000/api/v1/",
// baseURL: "http://192.168.18.5:8000/api/v1",
