import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyResetOtp } from "../../api/auth";
import type { VerifyResetOtpData } from "../../types/auth";
import { getFieldError, normalizeApiError } from "../../utils/error";

function VerifyResetOtp() {
    const navigate = useNavigate();

    const email = localStorage.getItem("reset_email") || "";

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");

    const mutation = useMutation({
        mutationFn: verifyResetOtp,

        onSuccess: (data) => {
            localStorage.setItem("reset_token", data.reset_token);
            toast.success("OTP verified. You can reset your password now.");
            navigate("/password-reset");
        },

        onError: (error: unknown) => {
            const appError = normalizeApiError(error);
            const fieldError =
                getFieldError(appError.fieldErrors, "otp") ?? appError.message;
            setError(fieldError);
            toast.error(appError.message);
        },
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const data: VerifyResetOtpData = {
            email,
            otp,
        };

        mutation.mutate(data);
    };

    return (
        <div className="w-full">
            <div className="mb-7 sm:mb-8">
                <h1 className="text-xl sm:text-[22px] font-bold text-gray-100">
                    Verify OTP
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Enter the OTP sent to your email.
                </p>

                <p className="mt-1 text-sm text-gray-300">{email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="mb-2 block text-sm text-gray-300">
                        OTP
                    </label>

                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        required
                        maxLength={6}
                        className="w-full rounded-lg border border-[#252b33] bg-[#171c23] px-4 py-3 text-center text-lg tracking-[0.5em] text-white outline-none transition focus:border-blue-500"
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
                    {mutation.isPending ? "Verifying..." : "Verify OTP"}
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

export default VerifyResetOtp;
