// market status
export interface MarketStatusResponse {
    status: string;
    time: string;
}

// market overview
export interface IncidesData {
    symbol: string;
    name: string;
    ltp: string;
    change: string;
    change_percent: number | null;
}

export interface MarketSummaryData {
    total_turnover: string | null;
    total_transactions: number | null;
    total_volume?: number | null;
    advances: number | null;
    declines: number | null;
    unchanged: number | null;
}

export interface StockSummaryData {
    total_companies: number | null;
    total_traded: number | null;
    total_turnover: number | null;
    total_transactions: number | null;
}

export interface MarketOverviewData {
    market_status: MarketStatusResponse;
    market_summary: MarketSummaryData;
    stock_summary: StockSummaryData;
    indices: IncidesData[];
    top_gainers?: GainerLooserStockData[];
    top_losers?: GainerLooserStockData[];
    top_turnover?: Company[];
    top_traded_shares?: Company[];
    top_transactions?: Company[];
}

export interface GainerLooserStockData {
    symbol: string;
    name: string;
    sector: string | null;
    ltp: string | null;
    change: string | null;
    change_percent: string | null;
}

export type Company = GainerLooserStockData;

export interface CompanyQuote extends Company {
    open: string | null;
    high: string | null;
    low: string | null;
    volume: number | null;
    turnover: string | null;
    transactions: number | null;
    previous_close: string | null;
    updated_at: string | null;
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
    gainers: GainerLooserStockData[];
    losers: GainerLooserStockData[];
};

export interface PortfolioHolding {
    symbol: string;
    company_name: string;
    quantity: number;
    average_buy_price: string | number;
    current_price: string | number;
    market_value: string | number;
    unrealized_profit_loss: string | number;
}

export interface WalletResponse {
    virtual_balance: string | number;
}

export interface WatchlistItem {
    id: number;
    symbol: string;
    created_at: string;
    market: Record<string, unknown>;
}

export interface OrderCreate {
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
}

export interface Order {
    id: number;
    symbol: string;
    side: "BUY" | "SELL";
    quantity: number;
    price: string;
    total_amount: string;
    status: "EXECUTED" | "REJECTED";
    created_at: string;
}
