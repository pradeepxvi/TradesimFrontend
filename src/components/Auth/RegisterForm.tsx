import type { ChangeEvent, FormEvent } from "react";

import { Link } from "react-router-dom";

import type { RegisterData } from "../../types/auth";

type RegisterFormProps = {
    formData: RegisterData;

    errors: Record<string, string[]>;

    isLoading: boolean;

    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;

    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const RegisterForm = ({
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
}: RegisterFormProps) => {
    return (
        <div className="w-full">
            {/* Heading */}
            <div className="mb-7 sm:mb-8">
                <h1 className="text-xl sm:text-[22px] font-bold text-gray-100">
                    Create an account
                </h1>

                <p className="mt-1 text-sm sm:text-base text-[#657892]">
                    Create your TradeSim account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Non field errors */}
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

                {/* Full Name */}
                <div className="w-full">
                    <label
                        htmlFor="full_name"
                        className="block text-sm sm:text-[15px] font-medium text-gray-200 mb-2"
                    >
                        Full name
                    </label>

                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Pradeep Kunwar"
                        autoComplete="name"
                        className="
                            block
                            w-full
                            h-11
                            rounded-md
                            border
                            border-[#272e37]
                            bg-[#171c23]
                            px-3.5
                            text-sm
                            sm:text-[15px]
                            text-gray-100
                            placeholder-[#62728a]
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-1
                            focus:ring-blue-500
                        "
                    />

                    {errors.full_name?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 text-sm text-red-400 break-words"
                        >
                            {error}
                        </p>
                    ))}
                </div>

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
                            text-sm
                            sm:text-[15px]
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

                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                        className="
                            block
                            w-full
                            h-11
                            rounded-md
                            border
                            border-[#272e37]
                            bg-[#171c23]
                            px-3.5
                            text-sm
                            sm:text-[15px]
                            text-gray-100
                            placeholder-[#62728a]
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-1
                            focus:ring-blue-500
                        "
                    />

                    {errors.password?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 text-sm text-red-400 break-words"
                        >
                            {error}
                        </p>
                    ))}
                </div>

                {/* Confirm Password */}
                <div className="w-full">
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm sm:text-[15px] font-medium text-gray-200 mb-2"
                    >
                        Confirm password
                    </label>

                    <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        className="
                            block
                            w-full
                            h-11
                            rounded-md
                            border
                            border-[#272e37]
                            bg-[#171c23]
                            px-3.5
                            text-sm
                            sm:text-[15px]
                            text-gray-100
                            placeholder-[#62728a]
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-1
                            focus:ring-blue-500
                        "
                    />

                    {errors.password_confirmation?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 text-sm text-red-400 break-words"
                        >
                            {error}
                        </p>
                    ))}
                </div>

                {/* Register Button */}
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
                        text-sm
                        sm:text-[15px]
                        font-medium
                        transition
                    "
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </button>
            </form>

            {/* Login */}
            <div className="text-center mt-6">
                <p className="text-sm sm:text-[15px] text-[#657892]">
                    Already have an account?{" "}
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
};

export default RegisterForm;
