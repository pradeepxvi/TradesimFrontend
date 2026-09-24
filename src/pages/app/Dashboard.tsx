import MarketMovers from "../../components/DashBoard/MarketMovers";
import MarketOverview from "../../components/DashBoard/MarketOverview";
import PortfolioPerformance from "../../components/DashBoard/PortfolioPerformance";
import Watchlist from "../../components/DashBoard/Watchlist";

const Dashboard = () => {
    return (
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
            <div>
                <h1 className="mt-1 text-2xl font-semibold text-white">
                    Dashboard
                </h1>
            </div>

            <MarketOverview />

            <div className="grid gap-5 xl:grid-cols-2">
                <PortfolioPerformance />
                <MarketMovers />
            </div>

            <Watchlist />
        </div>
    );
};

export default Dashboard;
