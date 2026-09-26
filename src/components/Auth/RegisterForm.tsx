import { Mail, UserRound } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";

import { Link } from "react-router-dom";

import type { RegisterData } from "../../types/auth";
import PasswordField from "./PasswordField";

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
            <div className="mb-7 sm:mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300">
                    <UserRound size={12} />
                    New account
                </div>

                <h1 className="text-2xl font-bold text-white sm:text-[28px]">
                    Create an account
                </h1>

                <p className="mt-2 text-sm text-[#657892] sm:text-base">
                    Create your TradeSim account and start practicing.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {errors.non_field_errors?.map((error, index) => (
                    <p
                        key={index}
                        className="mt-1.5 break-words text-sm text-red-400"
                    >
                        {error}
                    </p>
                ))}

                {errors.form?.length > 0 && (
                    <div className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                        {errors.form.map((error, index) => (
                            <p
                                key={index}
                                className="break-words text-sm text-red-400"
                            >
                                {error}
                            </p>
                        ))}
                    </div>
                )}

                <div className="w-full">
                    <label
                        htmlFor="full_name"
                        className="mb-2 block text-sm font-medium text-slate-200 sm:text-[15px]"
                    >
                        Full name
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                            <UserRound size={16} />
                        </span>
                        <input
                            id="full_name"
                            name="full_name"
                            type="text"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Pradeep Kunwar"
                            autoComplete="name"
                            className="block h-12 w-full rounded-2xl border border-[#272e37] bg-[#171c23] pl-11 pr-3.5 text-sm text-slate-100 placeholder:text-[#62728a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {errors.full_name?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 break-words text-sm text-red-400"
                        >
                            {error}
                        </p>
                    ))}
                </div>

                <div className="w-full">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-slate-200 sm:text-[15px]"
                    >
                        Email address
                    </label>

                    <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                            <Mail size={16} />
                        </span>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="pradeep@gmail.com"
                            autoComplete="email"
                            className="block h-12 w-full rounded-2xl border border-[#272e37] bg-[#171c23] pl-11 pr-3.5 text-sm text-slate-100 placeholder:text-[#62728a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    {errors.email?.map((error, index) => (
                        <p
                            key={index}
                            className="mt-1.5 break-words text-sm text-red-400"
                        >
                            {error}
                        </p>
                    ))}
                </div>

                <PasswordField
                    id="password"
                    name="password"
                    label="Password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    error={errors.password?.[0]}
                />

                <PasswordField
                    id="password_confirmation"
                    name="password_confirmation"
                    label="Confirm password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    error={errors.password_confirmation?.[0]}
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(37,99,235,0.28)] transition hover:from-blue-500 hover:to-blue-400 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-[#657892] sm:text-[15px]">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-400 transition hover:text-blue-300"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm;
