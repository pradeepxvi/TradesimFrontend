import { ChevronLeft, ChevronRight, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Companies } from "../../api/market";

const PAGE_SIZE = 10;

const AllListedStocks = () => {
    const [selectedSector, setSelectedSector] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const {
        data: stocks = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["companies"],
        queryFn: Companies,
        staleTime: 30_000,
    });

    const sectors = [
        "All",
        ...Array.from(
            new Set(stocks.map((stock) => stock.sector).filter(Boolean)),
        ).sort(),
    ] as string[];
    const filteredStocks =
        selectedSector === "All"
            ? stocks
            : stocks.filter((stock) => stock.sector === selectedSector);
    const pageCount = Math.max(1, Math.ceil(filteredStocks.length / PAGE_SIZE));
    const page = Math.min(currentPage, pageCount);
    const visibleStocks = filteredStocks.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
    );

    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <List size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                    All listed stocks
                </h2>
            </div>
            <div className="flex flex-wrap gap-2 border-b border-slate-800 p-4">
                {sectors.map((sector) => (
                    <button
                        key={sector}
                        onClick={() => {
                            setSelectedSector(sector);
                            setCurrentPage(1);
                        }}
                        className={`rounded-md px-3 py-1.5 text-xs ${selectedSector === sector ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"}`}
                    >
                        {sector}
                    </button>
                ))}
            </div>
            {isLoading ? (
                <div className="m-4 h-24 animate-pulse rounded-lg bg-slate-800/70" />
            ) : error ? (
                <p className="p-4 text-sm text-slate-500">
                    Listed stock data is unavailable right now.
                </p>
            ) : stocks.length === 0 ? (
                <p className="p-4 text-sm text-slate-500">
                    No listed stocks are currently available.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-xs">
                        <thead className="border-b border-slate-800 text-slate-500">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    Symbol
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Company
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Sector
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    LTP
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Change
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Change %
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {visibleStocks.map((stock) => {
                                const positive = Number(stock.change) >= 0;
                                return (
                                    <tr
                                        key={stock.symbol}
                                        className="hover:bg-slate-800/40"
                                    >
                                        <td className="px-4 py-3 font-mono font-semibold text-blue-400">
                                            <Link
                                                to={`/stocks/${encodeURIComponent(stock.symbol)}`}
                                                className="hover:text-blue-300"
                                            >
                                                {stock.symbol}
                                            </Link>
                                        </td>
                                        <td className="max-w-56 truncate px-4 py-3 text-slate-300">
                                            {stock.name}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {stock.sector || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-slate-200">
                                            {stock.ltp}
                                        </td>
                                        <td
                                            className={`px-4 py-3 text-right font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                                        >
                                            {positive ? "+" : ""}
                                            {stock.change}
                                        </td>
                                        <td
                                            className={`px-4 py-3 text-right font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                                        >
                                            {positive ? "+" : ""}
                                            {stock.change_percent}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
                        <span>
                            Showing{" "}
                            {filteredStocks.length === 0
                                ? 0
                                : (page - 1) * PAGE_SIZE + 1}
                            -{Math.min(page * PAGE_SIZE, filteredStocks.length)}{" "}
                            of {filteredStocks.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                aria-label="Previous page"
                                disabled={page === 1}
                                onClick={() =>
                                    setCurrentPage((value) =>
                                        Math.max(1, value - 1),
                                    )
                                }
                                className="rounded-md border border-slate-800 p-1.5 hover:text-slate-200 disabled:opacity-40"
                            >
                                <ChevronLeft size={14} />
                            </button>
                            <span className="px-2 text-slate-300">
                                {page} / {pageCount}
                            </span>
                            <button
                                aria-label="Next page"
                                disabled={page === pageCount}
                                onClick={() =>
                                    setCurrentPage((value) =>
                                        Math.min(pageCount, value + 1),
                                    )
                                }
                                className="rounded-md border border-slate-800 p-1.5 hover:text-slate-200 disabled:opacity-40"
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AllListedStocks;
