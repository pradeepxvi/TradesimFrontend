import axios from "axios";
import { getStoredUser } from "../utils/session";

const api = axios.create({
    baseURL: "https://0fe3-2405-acc0-1100-64b6-00-1.ngrok-free.app/api/v1/",
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

export default api;

// baseURL: "https://tb.pradipkunwar.name.np/api/v1",
// baseURL: "https://tradesimbackend.onrender.com/api/v1",
// baseURL: "http://127.0.0.1:8000/api/v1/",
// baseURL: "http://192.168.18.5:8000/api/v1",
