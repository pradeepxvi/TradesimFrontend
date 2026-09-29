import api from "../../api/axios";
import type { WatchlistItem } from "./types";

export const Watchlist = async (): Promise<WatchlistItem[]> => {
    const response = await api.get<WatchlistItem[]>("/watchlist/");
    return response.data;
};

export const AddWatchlist = async (symbol: string): Promise<WatchlistItem> => {
    const response = await api.post<WatchlistItem>("/watchlist/", { symbol });
    return response.data;
};

export const RemoveWatchlist = async (symbol: string): Promise<void> => {
    await api.delete(`/watchlist/${encodeURIComponent(symbol)}/`);
};
