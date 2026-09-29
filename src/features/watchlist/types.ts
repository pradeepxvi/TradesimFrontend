export interface WatchlistItem {
    id: number;
    symbol: string;
    created_at: string;
    market: Record<string, unknown>;
}
