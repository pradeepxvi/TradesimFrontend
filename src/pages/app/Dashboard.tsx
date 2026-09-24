import MarketMovers from "../../components/DashBoard/MarketMovers";
import MarketOverview from "../../components/DashBoard/MarketOverview";
import PortfolioPerformance from "../../components/DashBoard/PortfolioPerformance";
import Watchlist from "../../components/DashBoard/Watchlist";

const Dashboard = () => {
    return (
        <div className="mobile-stack">
            <header className="surface-card rounded-2xl p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                            Overview
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                            Dashboard
                        </h1>
                    </div>
                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-medium text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Live market
                    </div>
                </div>
            </header>

            <MarketOverview />

            <div className="grid gap-4 xl:grid-cols-2">
                <PortfolioPerformance />
                <MarketMovers />
            </div>

            <Watchlist />
        </div>
    );
};

export default Dashboard;
