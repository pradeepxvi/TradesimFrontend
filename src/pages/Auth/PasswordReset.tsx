import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../api/auth";
import type { PasswordResetData } from "../../types/auth";
import { getFieldError, normalizeApiError } from "../../utils/error";

function ResetPassword() {
    const navigate = useNavigate();

    const resetToken = localStorage.getItem("reset_token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: resetPassword,

        onSuccess: () => {
            localStorage.removeItem("reset_email");
            localStorage.removeItem("reset_token");
            toast.success("Password reset successful. Please log in.");
            navigate("/login");
        },

        onError: (error: unknown) => {
            const appError = normalizeApiError(error);
            const fieldError =
                getFieldError(appError.fieldErrors, "new_password") ??
                getFieldError(appError.fieldErrors, "confirm_password") ??
                getFieldError(appError.fieldErrors, "reset_token") ??
                appError.message;

            setError(fieldError);
            toast.error(appError.message);
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const data: PasswordResetData = {
            reset_token: resetToken,
            new_password: newPassword,
            confirm_password: confirmPassword,
        };

        mutation.mutate(data);
    };

    return (
        <div className="w-full">
            <div className="mb-7 sm:mb-8">
                <h1 className="text-xl sm:text-[22px] font-bold text-gray-100">
                    Reset password
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Create a new password for your account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        New password
                    </label>

                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Confirm password
                    </label>

                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-blue-500"
                    />
                </div>

                {error && <p className="text-sm text-red-400">{error}</p>}

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? "Resetting..." : "Reset password"}
                </button>
            </form>
            {/* Login */}
            <div className="text-center mt-6">
                <p className="text-sm sm:text-[15px] text-[#657892]">
                    Back To
                    <Link
                        to="/login"
                        className="text-blue-500 hover:text-blue-400 transition"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default ResetPassword;
