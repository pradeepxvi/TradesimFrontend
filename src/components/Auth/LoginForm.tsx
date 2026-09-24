import type { ChangeEvent, FormEvent } from "react";
import type { LoginData } from "../../types/auth";
import { Link } from "react-router-dom";

type LoginFormProps = {
    formData: LoginData;

    errors: Record<string, string[]>;

    isLoading: boolean;

    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;

    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const LoginForm = ({
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
}: LoginFormProps) => {
    return (
        <div className="w-full">
            {/* Heading */}
            <div className="mb-7 sm:mb-8">
                <h1 className="text-xl sm:text-[22px] font-bold text-gray-100">
                    Welcome back
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {errors.non_field_errors?.map((error, index) => (
                    <p
                        key={index}
                        className="mt-1.5 text-sm text-red-400 break-words"
                    >
                        {error}
                    </p>
                ))}

                {/* General Error */}
                {errors.form?.length > 0 && (
                    <div className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
                        {errors.form.map((error, index) => (
                            <p
                                key={index}
                                className="text-sm text-red-400 break-words"
                            >
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                {/* Email */}
                <div className="w-full">
                    <label
                        htmlFor="email"
                        className="block text-sm sm:text-[15px] font-medium text-gray-200 mb-2"
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="pradeep@gmail.com"
                        autoComplete="email"
                        className="
                            block
                            w-full
                            h-11
                            rounded-md
                            border
                            border-[#272e37]
                            bg-[#171c23]
                            px-3.5
                            text-sm sm:text-[15px]
                            text-gray-100
                            placeholder-[#62728a]
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-1
                            focus:ring-blue-500
                        "
                    />

                    {errors.email?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 text-sm text-red-400 break-words"
                        >
                            {error}
                        </p>
                    ))}
                </div>

                {/* Password */}
                <div className="w-full">
                    <label
                        htmlFor="password"
                        className="block text-sm sm:text-[15px] font-medium text-gray-200 mb-2"
                    >
                        Password
                    </label>

                    <div className="relative w-full">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="
                                block
                                w-full
                                h-11
                                rounded-md
                                border
                                border-[#272e37]
                                bg-[#171c23]
                                px-3.5
                                pr-12
                                text-sm sm:text-[15px]
                                text-gray-100
                                placeholder-[#62728a]
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-1
                                focus:ring-blue-500
                            "
                        />
                    </div>

                    {errors.password?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 text-sm text-red-400 break-words"
                        >
                            {error}
                        </p>
                    ))}

                    <div className="flex gap-2">
                        {/* Forgot */}
                        <div className="flex justify-end mt-2">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-500 hover:text-blue-400 transition"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        {/* Verify */}
                        <div className="flex justify-end mt-2">
                            <Link
                                to="/verify-otp"
                                className="text-sm text-blue-500 hover:text-blue-400 transition"
                            >
                                Verify Account
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="
                        w-full
                        h-11
                        rounded-md
                        bg-blue-600
                        hover:bg-blue-500
                        active:bg-blue-700
                        disabled:bg-blue-600/60
                        text-white
                        text-sm sm:text-[15px]
                        font-medium
                        transition
                    "
                >
                    {isLoading ? "Signing in..." : "Login"}
                </button>
            </form>

            {/* Register */}
            <div className="text-center mt-6">
                <p className="text-sm sm:text-[15px] text-[#657892]">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-500 hover:text-blue-400 transition"
                    >
                        Create here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
