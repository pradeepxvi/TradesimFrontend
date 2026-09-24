import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Companies, CompanyQuote, MarketMovers } from "../../api/market";
import StockDetailPanel from "../../components/DashBoard/StockDetailPanel";
import { useState } from "react";

import useMarket from "../../context/useMarket";

import type {
    CompanyQuote as CompanyQuoteData,
    GainerLooserStockData,
} from "../../types/market";

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
            <header className="surface-card rounded-2xl p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                    Market directory
                </p>
                <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    Stocks
                </h1>
                <p className="mt-2 text-sm text-slate-400">
                    Browse available market data and open a stock for its
                    details.
                </p>
            </header>

            <div className="surface-card rounded-2xl p-3 sm:p-4">
                <div className="relative max-w-md">
                    <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                        aria-label="Search stocks"
                        placeholder="Search by symbol or company"
                        className="h-11 w-full rounded-xl border border-slate-800 bg-[#1b222c] pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-blue-500/50"
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                const value = event.currentTarget.value.trim();
                                if (value) {
                                    navigate(
                                        `/stocks/${encodeURIComponent(value.toUpperCase())}`,
                                    );
                                }
                            }
                        }}
                    />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    {sectors.map((sector) => (
                        <button
                            key={sector}
                            onClick={() => {
                                setSelectedSector(sector);
                                setCurrentPage(1);
                            }}
                            className={`rounded-full px-3 py-1.5 text-xs ${selectedSector === sector ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "border border-slate-800 bg-[#151a21] text-slate-400 hover:text-slate-200"}`}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
            </div>

            {companiesQuery.isLoading ? (
                <div className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-[#151a21]" />
            ) : companiesQuery.error ? (
                <Message text="Stock data is unavailable right now." />
            ) : stocks.length === 0 ? (
                <Message text="No stock data is available from the market API." />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#151a21] shadow-2xl shadow-slate-950/20">
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

    /*
    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl p-4 sm:p-5 lg:p-6">
                <div className="h-72 animate-pulse rounded-lg border border-slate-800 bg-[#151a21]" />
            </div>
        );
    }

    if (hasError) {
        return <PageMessage text="Stock data is unavailable right now." />;
    }

    if (!stock) {
        return (
            <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-5 lg:p-6">
                <BackButton onBack={onBack} />
                <Message
                    text={`No market data was found for ${symbol.toUpperCase()}.`}
                />
            </div>
        );
    }

    const positive = Number(stock.change) >= 0;

    return (
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
            <BackButton onBack={onBack} />
            <section className="rounded-lg border border-slate-800 bg-[#151a21] p-5 sm:p-6">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                    <div>
                        <p className="font-mono text-sm font-semibold text-blue-400">
                            {stock.symbol}
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-white">
                            {stock.name}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {stock.sector || "Sector not provided"}
                        </p>
                    </div>
                    <div className="sm:text-right">
                        <p className="font-mono text-3xl font-semibold text-white">
                            {stock.ltp}
                        </p>
                        <p
                            className={`mt-1 flex items-center gap-1 font-mono text-sm sm:justify-end ${positive ? "text-emerald-400" : "text-red-400"}`}
                        >
                            {positive ? (
                                <ArrowUpRight size={15} />
                            ) : (
                                <ArrowDownRight size={15} />
                            )}
                            {positive ? "+" : ""}
                            {stock.change} ({stock.change_percent}%)
                        </p>
                    </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <DetailMetric label="Last traded price" value={stock.ltp} />
                    <DetailMetric
                        label="Price change"
                        value={`${positive ? "+" : ""}${stock.change}`}
                        tone={positive ? "positive" : "negative"}
                    />
                    <DetailMetric
                        label="Change percentage"
                        value={`${positive ? "+" : ""}${stock.change_percent}%`}
                        tone={positive ? "positive" : "negative"}
                    />
                </div>
            </section>
        </div>
    );
    */
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
