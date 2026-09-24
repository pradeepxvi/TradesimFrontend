import { createContext, type ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";
import type { MarketOverviewData } from "../types/market";
import { MarketOverview } from "../api/market";

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
