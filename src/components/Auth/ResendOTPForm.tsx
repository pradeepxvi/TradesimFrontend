import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

type ResendOTPFormProps = {
    email: string;
    isLoading: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const ResendOTPForm = ({
    email,
    isLoading,
    handleChange,
    handleSubmit,
}: ResendOTPFormProps) => {
    return (
        <div className="w-full">
            <h1>{email}</h1>
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
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full rounded-lg border border-[#252b33] bg-[#171c23] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Verifying..." : "Verify Email"}
                </button>

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
            </form>
        </div>
    );
};

export default ResendOTPForm;
