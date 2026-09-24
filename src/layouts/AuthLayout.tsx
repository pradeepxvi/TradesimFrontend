import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser } from "../utils/session";

const AuthLayout = () => {
    if (getStoredUser()) return <Navigate to="/dashboard" replace />;

    return (
        <div className="flex min-h-screen w-full flex-col bg-[#0b1020] text-white lg:flex-row">
            <header className="flex w-full items-center justify-between border-b border-white/8 bg-[#171c23]/80 px-5 py-5 backdrop-blur-xl lg:hidden">
                <div className="flex items-center gap-3">
                    <img
                        src="/tradesim-mark.svg"
                        alt="TradeSim"
                        className="h-11 w-11 shrink-0 object-contain"
                    />

                    <div>
                        <h1 className="text-base font-semibold leading-tight text-white">
                            TradeSim
                        </h1>
                        <p className="text-xs text-[#657892]">
                            NEPSE Paper Trading
                        </p>
                    </div>
                </div>
            </header>

            <aside className="hidden shrink-0 flex-col border-r border-white/8 bg-[#171c23]/85 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.18),transparent_30%)] px-8 py-10 backdrop-blur-xl lg:flex lg:w-[34%] xl:w-[32%] 2xl:w-[30%] xl:px-10 xl:py-12 2xl:px-12">
                <div className="flex items-center gap-3">
                    <img
                        src="/tradesim-mark.svg"
                        alt="TradeSim"
                        className="h-12 w-12 shrink-0 object-contain"
                    />

                    <div>
                        <h1 className="text-lg font-semibold leading-tight text-white">
                            TradeSim
                        </h1>
                        <p className="text-sm text-[#657892]">
                            NEPSE Paper Trading
                        </p>
                    </div>
                </div>

                <div className="mt-24 xl:mt-28 2xl:mt-36">
                    <h2 className="max-w-md text-2xl font-bold leading-tight text-white xl:text-[27px]">
                        Practice trading
                        <br />
                        without the risk.
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-6 text-[#71829c] xl:text-base">
                        TradeSim gives you a virtual portfolio to trade Nepal
                        Stock Exchange stocks in real time — no real money, all
                        the learning.
                    </p>

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

                <div className="mt-auto pt-10">
                    <p className="text-xs text-[#657892] xl:text-sm">
                        © 2026 TradeSim. For educational purposes only.
                    </p>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 items-center justify-center bg-[#0d1117]">
                <div className="w-full max-w-[520px] px-5 py-8 sm:px-8 sm:py-12 lg:px-8 xl:px-10 xl:py-16">
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
