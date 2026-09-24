import { Check, KeyRound, LoaderCircle, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChangePassword } from "../../api/auth";
import { Orders, Portfolio } from "../../api/market";
import type { ChangePasswordData } from "../../types/auth";
import { getStoredUser } from "../../utils/session";
import { sumNumericValues } from "../../utils/finance";

const Profilepage = () => {
    const session = getStoredUser() ?? undefined;
    const user = session?.user;
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const portfolioQuery = useQuery({
        queryKey: ["portfolio"],
        queryFn: Portfolio,
        staleTime: 30_000,
    });
    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: Orders,
        staleTime: 30_000,
    });
    const passwordMutation = useMutation({
        mutationFn: ChangePassword,
        onSuccess: () => {
            setIsChangingPassword(false);
            setMessage("Password updated successfully.");
        },
    });
    const holdings = portfolioQuery.data ?? [];
    const orders = ordersQuery.data ?? [];
    const portfolioValue = sumNumericValues(
        holdings.map((holding) => holding.market_value),
    );
    const totalProfitLoss = sumNumericValues(
        holdings.map((holding) => holding.unrealized_profit_loss),
    );
    const completedOrders = orders.filter(
        (order) => order.status === "EXECUTED",
    );
    return (
        <div className="mx-auto max-w-4xl space-y-5 p-4 sm:p-5 lg:p-6">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                    Account
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-white">
                    Profile
                </h1>
            </div>
            {message && (
                <div className="flex items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                    <span className="flex items-center gap-2">
                        <Check size={14} />
                        {message}
                    </span>
                    <button
                        aria-label="Dismiss message"
                        onClick={() => setMessage(null)}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
            <section className="rounded-lg border border-slate-800 bg-[#151a21] p-6">
                <div className="flex flex-col justify-between gap-5 border-b border-slate-800 pb-5 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white">
                            {user?.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">
                                {user?.full_name || "User"}
                            </h2>
                            <p className="text-sm text-slate-500">
                                {user?.email || "Email unavailable"}
                            </p>
                            <span className="mt-2 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-400">
                                {user?.is_verified
                                    ? "Active Account"
                                    : "Verification Required"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid gap-5 pt-5 sm:grid-cols-3">
                    <ProfileField
                        label="Full Name"
                        value={user?.full_name || "-"}
                    />
                    <ProfileField
                        label="Email Address"
                        value={user?.email || "-"}
                    />
                </div>
            </section>
            <section className="rounded-lg border border-slate-800 bg-[#151a21] p-5">
                <h2 className="text-base font-semibold text-slate-100">
                    Account Statistics
                </h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-4">
                    <Stat label="Total Trades" value={String(orders.length)} />
                    <Stat
                        label="Portfolio Value"
                        value={formatAmount(portfolioValue)}
                    />
                    <Stat
                        label="Total P/L"
                        value={formatSignedAmount(totalProfitLoss)}
                        tone={
                            totalProfitLoss === null
                                ? "neutral"
                                : totalProfitLoss >= 0
                                  ? "positive"
                                  : "negative"
                        }
                    />
                    <Stat
                        label="Completed"
                        value={String(completedOrders.length)}
                    />
                </div>
            </section>
            <section className="rounded-lg border border-slate-800 bg-[#151a21] p-5">
                <h2 className="text-base font-semibold text-slate-100">
                    Security
                </h2>
                <div className="mt-4 flex items-center justify-between border-b border-slate-800 py-4">
                    <div>
                        <p className="text-sm text-slate-200">Password</p>
                        <p className="mt-1 text-xs text-slate-500">
                            Keep your account credentials up to date.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsChangingPassword(true)}
                        className="flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:border-blue-500/50 hover:text-white"
                    >
                        <KeyRound size={14} />
                        Change Password
                    </button>
                </div>
            </section>
            {isChangingPassword && (
                <ChangePasswordDialog
                    onClose={() => {
                        setIsChangingPassword(false);
                        passwordMutation.reset();
                    }}
                    onSubmit={(data) => passwordMutation.mutate(data)}
                    isPending={passwordMutation.isPending}
                    hasError={passwordMutation.isError}
                />
            )}
        </div>
    );
};

const ProfileField = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-2 text-sm text-slate-200">{value}</p>
    </div>
);
const Stat = ({
    label,
    value,
    tone = "neutral",
}: {
    label: string;
    value: string;
    tone?: "neutral" | "positive" | "negative";
}) => (
    <div className="rounded-md bg-[#1b222c] p-4 text-center">
        <p className="text-xs text-slate-500">{label}</p>
        <p
            className={`mt-2 font-mono text-base font-semibold ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-red-400" : "text-slate-100"}`}
        >
            {value}
        </p>
    </div>
);
const formatAmount = (value: number | null) =>
    value === null
        ? "N/A"
        : `Rs ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatSignedAmount = (value: number | null) =>
    value === null
        ? "N/A"
        : `${value >= 0 ? "+" : "-"}${formatAmount(Math.abs(value))}`;

const ChangePasswordDialog = ({
    onClose,
    onSubmit,
    isPending,
    hasError,
}: {
    onClose: () => void;
    onSubmit: (data: ChangePasswordData) => void;
    isPending: boolean;
    hasError: boolean;
}) => {
    const [formData, setFormData] = useState<ChangePasswordData>({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [visible, setVisible] = useState(false);
    const valid =
        formData.current_password.length > 0 &&
        formData.new_password.length >= 8 &&
        formData.new_password === formData.confirm_password;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (valid) onSubmit(formData);
                }}
                className="w-full max-w-md rounded-lg border border-slate-700 bg-[#151a21] p-5 shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <h2 className="text-base font-semibold text-white">
                        Change Password
                    </h2>
                    <button
                        type="button"
                        aria-label="Close dialog"
                        onClick={onClose}
                        className="text-slate-500 hover:text-white"
                    >
                        <X size={18} />
                    </button>
                </div>
                <PasswordInput
                    label="Current Password"
                    value={formData.current_password}
                    placeholder="Current password"
                    visible={visible}
                    onChange={(value) =>
                        setFormData({ ...formData, current_password: value })
                    }
                />
                <PasswordInput
                    label="New Password"
                    value={formData.new_password}
                    placeholder="New password"
                    visible={visible}
                    onChange={(value) =>
                        setFormData({ ...formData, new_password: value })
                    }
                />
                <PasswordInput
                    label="Confirm New Password"
                    value={formData.confirm_password}
                    placeholder="Confirm new password"
                    visible={visible}
                    onChange={(value) =>
                        setFormData({ ...formData, confirm_password: value })
                    }
                />
                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    className="mt-2 text-xs text-slate-500 hover:text-slate-300"
                >
                    {visible ? "Hide passwords" : "Show passwords"}
                </button>
                {formData.new_password && formData.new_password.length < 8 && (
                    <p className="mt-2 text-xs text-amber-400">
                        New password must be at least 8 characters.
                    </p>
                )}
                {formData.confirm_password &&
                    formData.new_password !== formData.confirm_password && (
                        <p className="mt-2 text-xs text-red-400">
                            Passwords do not match.
                        </p>
                    )}
                {hasError && (
                    <p className="mt-2 text-xs text-red-400">
                        Could not update your password. Check your current
                        password and try again.
                    </p>
                )}
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-700 px-4 py-2 text-xs text-slate-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!valid || isPending}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
                    >
                        {isPending && (
                            <LoaderCircle size={13} className="animate-spin" />
                        )}
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    );
};

const PasswordInput = ({
    label,
    value,
    placeholder,
    visible,
    onChange,
}: {
    label: string;
    value: string;
    placeholder: string;
    visible: boolean;
    onChange: (value: string) => void;
}) => (
    <label className="mt-4 block text-sm text-slate-200">
        {label}
        <input
            type={visible ? "text" : "password"}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-500"
        />
    </label>
);

export default Profilepage;
