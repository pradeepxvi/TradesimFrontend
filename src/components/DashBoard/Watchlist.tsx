import { Bookmark } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Watchlist as getWatchlist } from "../../api/market";

const Watchlist = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["watchlist"],
        queryFn: getWatchlist,
        staleTime: 30_000,
    });

    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <Bookmark size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                    Watchlist
                </h2>
            </div>
            <div className="p-4">
                {isLoading ? (
                    <div className="h-20 animate-pulse rounded-lg bg-slate-800/70" />
                ) : isError ? (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-300">
                        <p className="font-medium text-amber-300">
                            Unable to load your watchlist
                        </p>
                        <p className="mt-1 text-slate-400">
                            We couldn't reach your saved stocks right now.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-3 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20"
                        >
                            Retry
                        </button>
                    </div>
                ) : !data || data.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        Your watchlist is empty.
                    </p>
                ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data.map((item) => (
                            <Link
                                key={item.id}
                                to={`/stocks/${encodeURIComponent(item.symbol)}`}
                                className="rounded-lg border border-slate-800 bg-[#1b222c] px-3 py-2.5"
                            >
                                <p className="font-mono text-sm font-semibold text-slate-200">
                                    {item.symbol}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                    {getMarketLabel(item.market)}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

const getMarketLabel = (market: Record<string, unknown>) => {
    const name = market.name ?? market.symbol ?? market.code;
    return typeof name === "string" ? name : "Market not provided";
};

export default Watchlist;
