import AllListedStocks from "../../components/DashBoard/AllListedStocks";
import MarketMovers from "../../components/DashBoard/MarketMovers";
import MarketOverview from "../../components/DashBoard/MarketOverview";
import SectorPerformance from "../../components/DashBoard/SectorPerformance";

const Marketpage = () => {
    return (
        <div className="mobile-stack">
            <header className="surface-card rounded-2xl p-4 sm:p-5">
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

            <MarketOverview title="Market overview" />

            <div className="grid gap-4  xl:grid-cols-3">
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
