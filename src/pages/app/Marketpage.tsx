import AllListedStocks from "../../components/DashBoard/AllListedStocks";
import MarketMovers from "../../components/DashBoard/MarketMovers";
import MarketOverview from "../../components/DashBoard/MarketOverview";
import SectorPerformance from "../../components/DashBoard/SectorPerformance";

const Marketpage = () => {
    return (
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                    Live market
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-white">
                    Market
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Track indices, sectors, movers, and listed companies.
                </p>
            </div>

            <MarketOverview title="Market overview" />

            <div className="grid gap-5 xl:grid-cols-3">
                <SectorPerformance />
                <div className="xl:col-span-2">
                    <MarketMovers title="Stock movers" />
                </div>
            </div>

            <AllListedStocks />
        </div>
    );
};

export default Marketpage;
