import { createContext, useContext, type ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import type { MarketOverviewData } from "../features/market/types";
import { MarketOverview } from "../features/market/api";

interface MarketContextType {
    market_overview: MarketOverviewData | undefined;
    isLoading: boolean;
    error: Error | null;
}

export const MarketContext = createContext<MarketContextType | undefined>(
    undefined,
);

const MarketProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["market-status"],
        queryFn: MarketOverview,
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
    });

    return (
        <MarketContext.Provider
            value={{
                market_overview: data,
                isLoading,
                error,
            }}
        >
            {children}
        </MarketContext.Provider>
    );
};
export default MarketProvider;

export const useMarket = () => {
    const context = useContext(MarketContext);

    if (!context) {
        throw new Error("useMarket must be used inside MarketProvider");
    }

    return context;
};
