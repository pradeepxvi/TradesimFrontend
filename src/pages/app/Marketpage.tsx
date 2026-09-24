import AllListedStocks from "../../components/DashBoard/AllListedStocks";
import MarketMovers from "../../components/DashBoard/MarketMovers";
import MarketOverview from "../../components/DashBoard/MarketOverview";
import SectorPerformance from "../../components/DashBoard/SectorPerformance";
import NepseChart from "../../components/DashBoard/NepseChart";

const Marketpage = () => {
    return (
        <div className="mobile-stack w-full min-w-0 space-y-4">
            <header className="surface-card w-full min-w-0 rounded-2xl p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Live market
                </p>

                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    Market
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    Track indices, sectors, movers, and listed companies.
                </p>
            </header>

            <div className="w-full min-w-0">
                <NepseChart />
            </div>

            <div className="w-full min-w-0">
                <MarketOverview title="Market overview" />
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="min-w-0">
                    <SectorPerformance />
                </div>

                <div className="min-w-0 xl:col-span-2">
                    <MarketMovers title="Stock movers" />
                </div>
            </div>

            <div className="w-full min-w-0">
                <AllListedStocks />
            </div>
        </div>
    );
};

export default Marketpage;
