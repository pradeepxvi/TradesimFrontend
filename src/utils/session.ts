import type { LoginResponse } from "../features/auth/types";

export const getStoredUser = (): LoginResponse | null => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
        const user = JSON.parse(storedUser) as LoginResponse;
        return user.access ? user : null;
    } catch {
        localStorage.removeItem("user");
        return null;
    }
};

export const saveStoredUser = (user: LoginResponse) => {
    localStorage.setItem("user", JSON.stringify(user));
};
