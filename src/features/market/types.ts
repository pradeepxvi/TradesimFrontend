// market status
export interface MarketStatusResponse {
    status: string;
    time: string;
}

// market overview
export interface IndicesData {
    symbol: string;
    name: string;
    ltp: string;
    change: string;
    change_percent: string | null;
}

export interface MarketSummaryData {
    total_turnover?: string | null;
    total_transactions?: number | null;
    total_volume?: number | null;
    advances?: number | null;
    declines?: number | null;
    unchanged?: number | null;
}

export interface StockSummaryData {
    total_companies: number | null;
    total_traded: number | null;
    total_turnover: number | null;
    total_transactions: number | null;
}

export interface GainerLoserStockData {
    symbol: string;
    name: string;
    sector: string | null;
    ltp: string | null;
    change: string | null;
    change_percent: string | null;
}

export type Company = GainerLoserStockData;

export interface CompanyQuoteData extends Company {
    open: string | null;
    high: string | null;
    low: string | null;
    volume: number | null;
    turnover: string | null;
    transactions: number | null;
    previous_close: string | null;
    updated_at: string | null;
}

export interface MarketOverviewData {
    market_status: MarketStatusResponse;
    market_summary?: MarketSummaryData;
    stock_summary: StockSummaryData;
    indices: IndicesData[];
    top_gainers?: GainerLoserStockData[];
    top_losers?: GainerLoserStockData[];
    top_turnover?: Company[];
    top_traded_shares?: Company[];
    top_transactions?: Company[];
}

export interface Candle {
    date: string | null;
    open: string | null;
    high: string | null;
    low: string | null;
    close: string | null;
    volume: string | null;
}

export interface ChangeSummary {
    name: string;
    change: string | null;
    change_percent: string | null;
    date: string | null;
}

export type GainerLooserData = {
    gainers: GainerLoserStockData[];
    losers: GainerLoserStockData[];
};

export interface WalletResponse {
    virtual_balance: string | number;
}
