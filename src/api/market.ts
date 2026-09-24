import api from "./axios";

import type {
    Candle,
    ChangeSummary,
    Company,
    CompanyQuote as CompanyQuoteData,
    GainerLooserData,
    MarketOverviewData,
    MarketStatusResponse,
    Order,
    OrderCreate,
    PortfolioHolding,
    WalletResponse,
    WatchlistItem,
} from "../types/market";

// market status
export const MarketStatus = async (): Promise<MarketStatusResponse> => {
    const reponse = await api.get("/market/status/");
    console.log(reponse.data);
    return reponse.data;
};

// market overview
export const MarketOverview = async (): Promise<MarketOverviewData> => {
    const response = await api.get<MarketOverviewData>("/market/overview/");
    return response.data;
};

export const MarketMovers = async (): Promise<GainerLooserData> => {
    const response = await api.get<GainerLooserData>("/market/gainers-losers/");
    return response.data;
};

export const Companies = async (): Promise<Company[]> => {
    const response = await api.get<Company[]>("/market/companies/");
    return response.data;
};

export const CompanyQuote = async (
    symbol: string,
): Promise<CompanyQuoteData> => {
    const response = await api.get<CompanyQuoteData>(
        `/market/companies/${encodeURIComponent(symbol)}/`,
    );
    return response.data;
};

export const CompanyCandles = async (symbol: string): Promise<Candle[]> => {
    const response = await api.get<Candle[]>(
        `/market/companies/${encodeURIComponent(symbol)}/candles/`,
    );
    return response.data;
};

export const CompanyChangeSummary = async (
    symbol: string,
): Promise<ChangeSummary[]> => {
    const response = await api.get<ChangeSummary[]>(
        `/market/change-summary/${encodeURIComponent(symbol)}/`,
    );
    return response.data;
};

export const CreateOrder = async (data: OrderCreate): Promise<Order> => {
    const response = await api.post<Order>("/trading/orders/", data);
    return response.data;
};

export const Orders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>("/trading/orders/");
    return response.data;
};

export const CancelOrder = async (orderId: number): Promise<Order> => {
    const response = await api.delete<Order>(`/trading/orders/${orderId}/`);
    return response.data;
};

export const AddWatchlist = async (symbol: string): Promise<WatchlistItem> => {
    const response = await api.post<WatchlistItem>("/watchlist/", { symbol });
    return response.data;
};

export const RemoveWatchlist = async (symbol: string): Promise<void> => {
    await api.delete(`/watchlist/${encodeURIComponent(symbol)}/`);
};

export const Portfolio = async (): Promise<PortfolioHolding[]> => {
    const response = await api.get<PortfolioHolding[]>("/trading/portfolio/");
    return response.data;
};

export const Wallet = async (): Promise<WalletResponse> => {
    const response = await api.get<WalletResponse>("/trading/wallet/");
    return response.data;
};

export const Watchlist = async (): Promise<WatchlistItem[]> => {
    const response = await api.get<WatchlistItem[]>("/watchlist/");
    return response.data;
};

export const NepseCandles = async (): Promise<Candle[]> => {
    const response = await api.get("market/indices/nepse/candles/");
    return response.data;
};
