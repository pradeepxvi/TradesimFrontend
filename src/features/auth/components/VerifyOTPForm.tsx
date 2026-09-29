import type { ChangeEvent, FormEvent } from "react";
import type { VerifyOTPData } from "../../types/auth";
import { Link } from "react-router-dom";

type VerifyOTPFormProps = {
    formData: VerifyOTPData;
    errors: string;
    isLoading: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const VerifyOTPForm = ({
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
}: VerifyOTPFormProps) => {
    return (
        <div className="w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Verify your email
                </h1>

                <p className="mt-2 text-sm text-gray-400">
                    Enter the verification code sent to your email.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <p className="mt-1.5 text-sm text-red-400 break-words">
                    {errors}
                </p>
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-[#252b33] bg-[#171c23] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                    />
                </div>

                {/* OTP */}
                <div>
                    <label
                        htmlFor="otp"
                        className="mb-2 block text-sm font-medium text-gray-300"
                    >
                        Verification Code
                    </label>

                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={formData.otp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit code"
                        className="w-full rounded-lg border border-[#252b33] bg-[#171c23] px-4 py-3 text-center text-lg tracking-[0.5em] text-white outline-none transition focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Verifying..." : "Verify Email"}
                </button>
                {/* Verify */}
                <div className="flex justify-between">
                    <div className="text-center">
                        <p className="text-sm sm:text-[15px] text-[#657892]">
                            Back To{" "}
                            <Link
                                to="/login"
                                className="text-blue-500 hover:text-blue-400 transition"
                            >
                                Login
                            </Link>
                        </p>
                    </div>

                    <div className="text-center">
                        <p className="text-sm sm:text-[15px] text-[#657892]">
                            <Link
                                to="/resend-otp"
                                className="text-blue-500 hover:text-blue-400 transition"
                            >
                                Request new OTP
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VerifyOTPForm;
