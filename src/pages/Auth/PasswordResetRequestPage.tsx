import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { requestPasswordReset } from "../../api/auth";
import type { PasswordResetRequestData } from "../../types/auth";
import { getFieldError, normalizeApiError } from "../../utils/error";

function PasswordResetRequestPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: requestPasswordReset,

        onSuccess: () => {
            localStorage.setItem("reset_email", email);
            toast.success("OTP sent to your email.");
            navigate("/password-reset/verify-otp");
        },

        onError: (error: unknown) => {
            const appError = normalizeApiError(error);
            const fieldError = getFieldError(appError.fieldErrors, "email");
            setError(fieldError ?? appError.message);
            toast.error(appError.message);
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const data: PasswordResetRequestData = {
            email,
        };

        mutation.mutate(data);
    };

    return (
        <div className="w-full">
            <div className="mb-7 sm:mb-8">
                <h1 className="text-xl sm:text-[22px] font-bold text-gray-100">
                    Forgot password?
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Enter your email and we'll send you an OTP.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 outline-none focus:border-blue-500"
                    />

                    {error && (
                        <p className="mt-2 text-sm text-red-400">{error}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {mutation.isPending ? "Sending..." : "Send OTP"}
                </button>
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
            </form>
        </div>
    );
}

export default PasswordResetRequestPage;
