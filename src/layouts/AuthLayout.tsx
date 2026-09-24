import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../utils/session";

const AuthLayout = () => {
    if (getStoredUser()) return <Navigate to="/dashboard" replace />;

    return (
        <div className="min-h-screen w-full bg-[#0d1117] text-white flex flex-col lg:flex-row">
            {/* =========================
                MOBILE / TABLET HEADER
            ========================== */}
            <header className="flex lg:hidden items-center justify-between w-full px-5 sm:px-8 py-5 bg-[#171c23] border-b border-[#252b33]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xl font-bold">〽</span>
                    </div>

                    <div>
                        <h1 className="text-base sm:text-lg font-semibold leading-tight">
                            TradeSim
                        </h1>

                        <p className="text-xs sm:text-sm text-[#657892]">
                            NEPSE Paper Trading
                        </p>
                    </div>
                </div>
            </header>

            {/* =========================
                DESKTOP SIDEBAR
            ========================== */}
            <aside className="hidden lg:flex lg:w-[34%] xl:w-[32%] 2xl:w-[30%] bg-[#171c23] border-r border-[#252b33] flex-col px-8 xl:px-10 2xl:px-12 py-10 xl:py-12 shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <span className="text-white text-xl font-bold">〽</span>
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold leading-tight">
                            TradeSim
                        </h1>

                        <p className="text-sm text-[#657892]">
                            NEPSE Paper Trading
                        </p>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="mt-28 xl:mt-36 2xl:mt-44">
                    <h2 className="text-2xl xl:text-[27px] leading-tight font-bold max-w-md">
                        Practice trading
                        <br />
                        without the risk.
                    </h2>

                    <p className="mt-4 text-sm xl:text-base text-[#71829c] leading-6 max-w-md">
                        TradeSim gives you a virtual portfolio to trade Nepal
                        Stock Exchange stocks in real-time — no real money, all
                        the learning.
                    </p>

                    {/* Features */}
                    <div className="mt-8 space-y-5">
                        <Feature
                            title="Real NEPSE market data"
                            description="Live prices and market depth"
                        />

                        <Feature
                            title="Virtual Rs 10,00,000 balance"
                            description="Start trading immediately"
                        />

                        <Feature
                            title="Full portfolio analytics"
                            description="Track your performance over time"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-10">
                    <p className="text-xs xl:text-sm text-[#657892]">
                        © 2026 TradeSim. For educational purposes only.
                    </p>
                </div>
            </aside>

            {/* =========================
                MAIN CONTENT
            ========================== */}
            <main className="flex-1 min-w-0 flex justify-center">
                <div
                    className="
                        w-full
                        max-w-[520px]
                        px-5
                        sm:px-8
                        md:px-10
                        lg:px-8
                        xl:px-10
                        py-10
                        sm:py-12
                        lg:py-16
                        xl:py-20
                    "
                >
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

type FeatureProps = {
    title: string;
    description: string;
};

const Feature = ({ title, description }: FeatureProps) => {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 w-[22px] h-[22px] rounded-full border border-blue-500/40 flex items-center justify-center shrink-0">
                <div className="w-[6px] h-[6px] rounded-full bg-blue-500" />
            </div>

            <div className="min-w-0">
                <p className="text-sm xl:text-[15px] font-medium text-gray-100">
                    {title}
                </p>

                <p className="text-xs xl:text-sm text-[#657892] mt-0.5">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
