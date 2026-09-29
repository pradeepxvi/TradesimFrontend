import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useMarket } from "../../context/MarketContext";
import {
    Companies,
    CompanyQuote,
    MarketMovers,
} from "../../features/market/api";
import StockDetailPanel from "../../features/market/components/StockDetailPanel";
import StockFilters from "../../features/market/components/StockFilters";
import type { CompanyQuoteData } from "../../features/market/types";

const PAGE_SIZE = 10;

const Stockspage = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSector, setSelectedSector] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const { market_overview } = useMarket();
    const moversQuery = useQuery({
        queryKey: ["market-movers"],
        queryFn: MarketMovers,
        staleTime: 30_000,
    });

    const companiesQuery = useQuery({
        queryKey: ["companies"],
        queryFn: Companies,
        staleTime: 30_000,
    });

    const quoteQuery = useQuery({
        queryKey: ["company", symbol],
        queryFn: () => CompanyQuote(symbol ?? ""),
        enabled: Boolean(symbol),
        staleTime: 30_000,
    });

    const stocks =
        companiesQuery.data ??
        getStocks(
            market_overview?.top_gainers,
            market_overview?.top_losers,
            moversQuery.data,
        );
    const sectors = [
        "All",
        ...Array.from(
            new Set(stocks.map((stock) => stock.sector).filter(Boolean)),
        ).sort(),
    ] as string[];
    const filteredStocks = stocks.filter((stock) => {
        const matchesSector =
            selectedSector === "All" || stock.sector === selectedSector;
        const search = searchTerm.trim().toLowerCase();
        return (
            matchesSector &&
            (!search ||
                stock.symbol.toLowerCase().includes(search) ||
                stock.name.toLowerCase().includes(search))
        );
    });
    const pageCount = Math.max(1, Math.ceil(filteredStocks.length / PAGE_SIZE));
    const page = Math.min(currentPage, pageCount);
    const visibleStocks = filteredStocks.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE,
    );
    if (symbol) {
        return (
            <StockDetail
                symbol={symbol}
                stock={quoteQuery.data}
                isLoading={quoteQuery.isLoading}
                hasError={Boolean(quoteQuery.error)}
                onBack={() => navigate("/stocks")}
            />
        );
    }

    return (
        <div className="mobile-stack">
            <StockFilters
                searchTerm={searchTerm}
                selectedSector={selectedSector}
                sectors={sectors}
                onSearchChange={(value) => {
                    setSearchTerm(value);
                    setCurrentPage(1);
                }}
                onSectorChange={(value) => {
                    setSelectedSector(value);
                    setCurrentPage(1);
                }}
                onSearchSubmit={() => {
                    const value = searchTerm.trim();
                    if (value) {
                        navigate(`/stocks/${encodeURIComponent(value.toUpperCase())}`);
                    }
                }}
            />

            {companiesQuery.isLoading ? (
                <div className="h-64 rounded-xl border border-slate-800 bg-[#151a21]" />
            ) : companiesQuery.error ? (
                <Message text="Stock data is unavailable right now." />
            ) : stocks.length === 0 ? (
                <Message text="No stock data is available from the market API." />
            ) : (
                <div className="surface-card overflow-hidden rounded-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-xs">
                            <thead className="border-b border-slate-800 bg-[#1a212b] text-slate-500">
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
                                {visibleStocks.map((stock) => (
                                    <StockRow
                                        key={stock.symbol}
                                        stock={stock}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
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
        </div>
    );
};

const StockDetail = ({
    symbol,
    stock,
    isLoading,
    hasError,
    onBack,
}: {
    symbol: string;
    stock?: CompanyQuoteData;
    isLoading: boolean;
    hasError: boolean;
    onBack: () => void;
}) => {
    return (
        <StockDetailPanel
            symbol={symbol}
            stock={stock}
            isLoading={isLoading}
            hasError={hasError}
            onBack={onBack}
        />
    );
};

const StockRow = ({ stock }: { stock: GainerLooserStockData }) => {
    const positive = Number(stock.change) >= 0;
    return (
        <tr className="hover:bg-slate-800/40">
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
            <td className="px-4 py-3 text-slate-500">{stock.sector || "-"}</td>
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
};

const Message = ({ text }: { text: string }) => (
    <p className="rounded-lg border border-slate-800 bg-[#151a21] p-5 text-sm text-slate-500">
        {text}
    </p>
);
const getStocks = (
    topGainers: GainerLooserStockData[] | undefined,
    topLosers: GainerLooserStockData[] | undefined,
    movers:
        | { gainers: GainerLooserStockData[]; losers: GainerLooserStockData[] }
        | undefined,
) => {
    const sources = [
        ...(topGainers ?? []),
        ...(topLosers ?? []),
        ...(movers?.gainers ?? []),
        ...(movers?.losers ?? []),
    ];
    return sources.filter(
        (stock, index, all) =>
            all.findIndex((item) => item.symbol === stock.symbol) === index,
    );
};

export default Stockspage;
