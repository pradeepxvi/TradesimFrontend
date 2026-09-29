import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ChangeEvent } from "react";

type PasswordFieldProps = {
    id: string;
    name: string;
    label: string;
    value: string;
    placeholder: string;
    autoComplete?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
};

const PasswordField = ({
    id,
    name,
    label,
    value,
    placeholder,
    autoComplete,
    onChange,
    error,
}: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="mb-2 block text-sm font-medium text-slate-200 sm:text-[15px]"
            >
                {label}
            </label>

            <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock size={16} />
                </span>

                <input
                    id={id}
                    name={name}
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-label={label}
                    className="block h-12 w-full rounded-2xl border border-[#272e37] bg-[#171c23] pl-11 pr-12 text-sm text-slate-100 placeholder:text-[#62728a] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <button
                    type="button"
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-2xl text-slate-400 transition hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/25"
                >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {error && (
                <p className="mt-1.5 break-words text-sm text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PasswordField;
