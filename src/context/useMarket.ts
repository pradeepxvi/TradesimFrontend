import { useContext } from "react";
import { MarketContext } from "./MarketContext";

const useMarket = () => {
    const context = useContext(MarketContext);

    if (!context) {
        throw new Error("useMarket must be used inside MarketProvider");
    }

    return context;
};

export default useMarket;
