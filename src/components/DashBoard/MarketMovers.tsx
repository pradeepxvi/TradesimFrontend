import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { MarketMovers as getMarketMovers } from "../../api/market";
import type { GainerLooserStockData } from "../../types/market";

const MarketMovers = ({ title = "Market movers" }: { title?: string }) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["market-movers"],
        queryFn: getMarketMovers,
        staleTime: 30_000,
        refetchInterval: 30_000,
    });

    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <TrendingUp size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                    {title}
                </h2>
            </div>
            <div className="p-4">
                {isLoading ? (
                    <div className="h-48 animate-pulse rounded-lg bg-slate-800/70" />
                ) : isError ? (
                    <p className="text-sm text-slate-500">
                        Market movers are unavailable right now.
                    </p>
                ) : !data ||
                  (data.gainers.length === 0 && data.losers.length === 0) ? (
                    <p className="text-sm text-slate-500">
                        No market mover data is available.
                    </p>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2">
                        <MoverList
                            title="Top gainers"
                            stocks={data.gainers}
                            positive
                        />
                        <MoverList title="Top losers" stocks={data.losers} />
                    </div>
                )}
            </div>
        </section>
    );
};

const MoverList = ({
    title,
    stocks,
    positive = false,
}: {
    title: string;
    stocks: GainerLooserStockData[];
    positive?: boolean;
}) => (
    <div>
        <h3
            className={`mb-2 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}
        >
            {title}
        </h3>
        <div className="divide-y divide-slate-800">
            {stocks.slice(0, 5).map((stock) => (
                <Link
                    key={stock.symbol}
                    to={`/stocks/${encodeURIComponent(stock.symbol)}`}
                    className="flex items-center gap-3 py-2.5"
                >
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs font-semibold text-slate-200">
                            {stock.symbol}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {stock.name}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono text-xs font-semibold text-slate-200">
                            {stock.ltp}
                        </p>
                        <p
                            className={`flex items-center justify-end gap-0.5 font-mono text-[11px] ${positive ? "text-emerald-400" : "text-red-400"}`}
                        >
                            {positive ? (
                                <ArrowUpRight size={12} />
                            ) : (
                                <ArrowDownRight size={12} />
                            )}
                            {positive ? "+" : ""}
                            {stock.change} ({stock.change_percent}%)
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    </div>
);

export default MarketMovers;
