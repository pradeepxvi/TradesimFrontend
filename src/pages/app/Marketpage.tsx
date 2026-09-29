import AllListedStocks from "../../features/market/components/AllListedStocks";
import MarketMovers from "../../features/market/components/MarketMovers";
import MarketOverview from "../../features/market/components/MarketOverview";
import SectorPerformance from "../../features/market/components/SectorPerformance";
import NepseChart from "../../features/market/components/NepseChart";

const Marketpage = () => {
    return (
        <div className="mobile-stack w-full min-w-0 space-y-4">
            <div className="w-full min-w-0">
                <NepseChart />
            </div>

            <div className="w-full min-w-0">
                <MarketOverview title="Overview" />
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="min-w-0">
                    <SectorPerformance />
                </div>

                <div className="min-w-0 xl:col-span-2">
                    <MarketMovers title="Movers" />
                </div>
            </div>

            <div className="w-full min-w-0">
                <AllListedStocks />
            </div>
        </div>
    );
};

export default Marketpage;
