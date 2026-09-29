import api from "../../api/axios";

import type {
    Candle,
    ChangeSummary,
    Company,
    CompanyQuoteData,
    GainerLooserData,
    MarketOverviewData,
    MarketStatusResponse,
    WalletResponse,
} from "./types";

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

export const Wallet = async (): Promise<WalletResponse> => {
    const response = await api.get<WalletResponse>("/trading/wallet/");
    return response.data;
};

export const NepseCandles = async (): Promise<Candle[]> => {
    const response = await api.get<Candle[]>("/market/indices/nepse/candles/");

    return response.data;
};
