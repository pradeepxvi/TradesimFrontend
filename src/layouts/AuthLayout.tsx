import { BarChart3, ShieldCheck, TrendingUp } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../utils/session";

const AuthLayout = () => {
    if (getStoredUser()) return <Navigate to="/dashboard" replace />;

    return (
        <div className="auth-shell flex min-h-screen w-full flex-col lg:flex-row">
            <header className="auth-brand-panel flex w-full items-center border-b px-5 py-4 lg:hidden">
                <div className="flex items-center gap-3">
                    <img
                        src="/tradesim-mark.svg"
                        alt="TradeSim"
                        className="h-10 w-10 shrink-0 object-contain"
                    />
                    <h1 className="text-base font-semibold">TradeSim</h1>
                </div>
            </header>

            <aside className="auth-brand-panel hidden shrink-0 flex-col border-r px-8 py-10 lg:flex lg:w-[34%] xl:w-[32%] 2xl:w-[30%] xl:px-10 xl:py-12 2xl:px-12">
                <div className="flex items-center gap-3">
                    <img
                        src="/tradesim-mark.svg"
                        alt="TradeSim"
                        className="h-12 w-12 shrink-0 object-contain"
                    />
                    <h1 className="text-lg font-semibold">TradeSim</h1>
                </div>

                <div className="mt-auto max-w-sm pb-6">
                    <p className="text-sm font-semibold text-slate-200">
                        Practice the market with less noise.
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#1e2027] px-3 py-2.5">
                            <BarChart3 size={17} className="shrink-0 text-[#b8860b]" />
                            <span className="text-xs text-slate-400">
                                Track NEPSE stocks and market moves.
                            </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#1e2027] px-3 py-2.5">
                            <TrendingUp size={17} className="shrink-0 text-[#b8860b]" />
                            <span className="text-xs text-slate-400">
                                Explore prices, watchlists and orders.
                            </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-[#1e2027] px-3 py-2.5">
                            <ShieldCheck size={17} className="shrink-0 text-[#b8860b]" />
                            <span className="text-xs text-slate-400">
                                Keep your practice account in one place.
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-8">
                <div className="w-full max-w-[500px]">
                    <div className="auth-panel p-4 sm:p-6 lg:p-7">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;
