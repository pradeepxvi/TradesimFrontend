import { Mail, ShieldCheck, TrendingUp } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { LoginData } from "../../types/auth";
import { Link } from "react-router-dom";
import PasswordField from "./PasswordField";

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
            <div className="mb-7 sm:mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-300">
                    <ShieldCheck size={12} />
                    Secure access
                </div>

                <h1 className="text-2xl font-bold text-white sm:text-[28px]">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-[#657892]">
                    Sign in to continue trading with your virtual portfolio.
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    error={errors.password?.[0]}
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-400 transition hover:text-blue-300"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            to="/verify-otp"
                            className="text-sm text-blue-400 transition hover:text-blue-300"
                        >
                            Verify Account
                        </Link>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 text-sm font-semibold text-white shadow-[0_18px_32px_rgba(37,99,235,0.28)] transition hover:from-blue-500 hover:to-blue-400 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Signing in..." : "Login"}
                </button>

                {/* Market navigation */}
                <Link
                    to="/market"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#272e37] bg-[#171c23] text-sm font-semibold text-slate-200 transition hover:border-blue-500/40 hover:bg-[#1c232d] hover:text-blue-400"
                >
                    <TrendingUp size={17} />
                    View Market
                </Link>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-[#657892] sm:text-[15px]">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-blue-400 transition hover:text-blue-300"
                    >
                        Create here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
