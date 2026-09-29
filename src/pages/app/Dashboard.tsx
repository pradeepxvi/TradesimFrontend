import MarketMovers from "../../features/market/components/MarketMovers";
import MarketOverview from "../../features/market/components/MarketOverview";
import PortfolioPerformance from "../../features/portfolio/components/PortfolioPerformance";
import Watchlist from "../../features/watchlist/components/Watchlist";

const Dashboard = () => {
    return (
        <div className="mobile-stack">
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
