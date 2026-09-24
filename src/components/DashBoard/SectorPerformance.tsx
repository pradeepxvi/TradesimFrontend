import { BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MarketMovers as getMarketMovers } from "../../api/market";

const SectorPerformance = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["market-movers"],
        queryFn: getMarketMovers,
        staleTime: 30_000,
    });

    const sectors = data
        ? Object.entries(
              [...data.gainers, ...data.losers].reduce<
                  Record<string, number[]>
              >((result, stock) => {
                  const sector = stock.sector || "Unclassified";
                  result[sector] ??= [];
                  result[sector].push(Number(stock.change_percent));
                  return result;
              }, {}),
          )
              .map(([sector, changes]) => ({
                  sector,
                  change:
                      changes.reduce((sum, value) => sum + value, 0) /
                      changes.length,
              }))
              .sort((a, b) => b.change - a.change)
        : [];

    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <BarChart3 size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                    Sector performance
                </h2>
            </div>
            <div className="space-y-3 p-4">
                {isLoading ? (
                    <div className="h-48 animate-pulse rounded-lg bg-slate-800/70" />
                ) : isError ? (
                    <Message text="Sector data is unavailable right now." />
                ) : sectors.length === 0 ? (
                    <Message text="No sector performance data is available." />
                ) : (
                    sectors.map((sector) => {
                        const positive = sector.change >= 0;
                        const width = Math.min(
                            Math.abs(sector.change) * 18,
                            100,
                        );

                        return (
                            <div key={sector.sector}>
                                <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                                    <span className="truncate text-slate-400">
                                        {sector.sector}
                                    </span>
                                    <span
                                        className={
                                            positive
                                                ? "font-mono text-emerald-400"
                                                : "font-mono text-red-400"
                                        }
                                    >
                                        {positive ? "+" : ""}
                                        {sector.change.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                                    <div
                                        className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-red-500"}`}
                                        style={{ width: `${width}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
};

const Message = ({ text }: { text: string }) => (
    <p className="text-sm text-slate-500">{text}</p>
);

export default SectorPerformance;
