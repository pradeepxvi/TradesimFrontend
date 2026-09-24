import {
    ArrowDownRight,
    ArrowLeft,
    ArrowUpRight,
    BarChart3,
    Bookmark,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    AddWatchlist,
    CompanyCandles,
    CompanyChangeSummary,
    CreateOrder,
    RemoveWatchlist,
    Wallet,
    Watchlist,
} from "../../api/market";

import { useRef, useState } from "react";
import useMarket from "../../context/useMarket";
import type { Candle, CompanyQuote } from "../../types/market";
import { getStoredUser } from "../../utils/session";

interface StockDetailPanelProps {
    symbol: string;
    stock?: CompanyQuote;
    isLoading: boolean;
    hasError: boolean;
    onBack: () => void;
}

const StockDetailPanel = ({
    symbol,
    stock,
    isLoading,
    hasError,
    onBack,
}: StockDetailPanelProps) => {
    const { market_overview } = useMarket();
    const authenticated = Boolean(getStoredUser());
    const candlesQuery = useQuery({
        queryKey: ["company-candles", stock?.symbol],
        queryFn: () => CompanyCandles(stock?.symbol ?? ""),
        enabled: Boolean(stock),
        staleTime: 30_000,
    });
    const summaryQuery = useQuery({
        queryKey: ["company-change-summary", stock?.symbol],
        queryFn: () => CompanyChangeSummary(stock?.symbol ?? ""),
        enabled: Boolean(stock),
        staleTime: 30_000,
    });
    const queryClient = useQueryClient();
    const watchlistQuery = useQuery({
        queryKey: ["watchlist"],
        queryFn: Watchlist,
        staleTime: 30_000,
        enabled: Boolean(stock) && authenticated,
    });
    const watchlistMutation = useMutation({
        mutationFn: async (watched: boolean) => {
            if (watched) {
                await RemoveWatchlist(stock?.symbol ?? "");
            } else {
                await AddWatchlist(stock?.symbol ?? "");
            }
        },
        onSuccess: (_, watched) => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
            toast.success(
                watched ? "Removed from watchlist." : "Added to watchlist.",
            );
        },
        onError: (_, watched) => {
            toast.error(
                watched
                    ? "Could not remove this stock from the watchlist."
                    : "Could not add this stock to the watchlist.",
            );
        },
    });

    if (isLoading) {
        return <Loading />;
    }

    if (hasError) {
        return <Message text="Stock data is unavailable right now." />;
    }

    if (!stock) {
        return (
            <PageShell>
                <BackButton onBack={onBack} />
                <Message
                    text={`No market data was found for ${symbol.toUpperCase()}.`}
                />
            </PageShell>
        );
    }

    const change = Number(stock.change);
    const positive = change >= 0;
    const marketOpen = market_overview?.market_status.status === "OPEN";

    return (
        <PageShell>
            <div className="flex items-center justify-between gap-4">
                <BackButton onBack={onBack} />
                <button
                    disabled={authenticated && watchlistMutation.isPending}
                    onClick={() => {
                        if (!authenticated) {
                            toast.info(
                                "You need to be authenticated to use your watchlist.",
                            );
                            return;
                        }

                        watchlistMutation.mutate(
                            Boolean(
                                watchlistQuery.data?.some(
                                    (item) =>
                                        item.symbol.toUpperCase() ===
                                        stock.symbol.toUpperCase(),
                                ),
                            ),
                        );
                    }}
                    className="flex items-center gap-2 rounded-md border border-slate-800 px-3 py-2 text-xs text-slate-400 hover:border-blue-500/50 hover:text-blue-300 disabled:opacity-50"
                >
                    <Bookmark size={14} />
                    {!authenticated
                        ? "Sign in to use watchlist"
                        : watchlistQuery.data?.some(
                                (item) =>
                                    item.symbol.toUpperCase() ===
                                    stock.symbol.toUpperCase(),
                            )
                          ? "Remove from watchlist"
                          : "Add to watchlist"}
                </button>
            </div>

            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="font-mono text-xl font-semibold text-slate-100">
                            {stock.symbol}
                        </h1>
                        <span
                            className={`rounded-full px-2 py-1 text-[11px] font-medium ${marketOpen ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}
                        >
                            {marketOpen ? "Market Open" : "Market Closed"}
                        </span>
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                        {stock.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {stock.sector || "Sector not provided"}
                    </p>
                </div>
                <div className="sm:text-right">
                    <p className="font-mono text-3xl font-semibold text-white">
                        Rs {stock.ltp}
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
            </section>

            <div className="grid gap-4 xl:grid-cols-3">
                <div className="xl:col-span-2">
                    <PriceChart
                        candles={candlesQuery.data ?? []}
                        isLoading={candlesQuery.isLoading}
                        hasError={Boolean(candlesQuery.error)}
                    />
                </div>
                <OrderPanel
                    symbol={stock.symbol}
                    price={stock.ltp}
                    authenticated={authenticated}
                />
            </div>

            <StockStatistics
                stock={stock}
                historyCount={summaryQuery.data?.length ?? 0}
            />
        </PageShell>
    );
};

const PriceChart = ({
    candles,
    isLoading,
    hasError,
}: {
    candles: Candle[];
    isLoading: boolean;
    hasError: boolean;
}) => {
    const ranges = [
        { label: "1D", days: 1 },
        { label: "1W", days: 7 },
        { label: "3M", days: 90 },
        { label: "6M", days: 180 },
        { label: "1Y", days: 365 },
    ];
    const [selectedRange, setSelectedRange] = useState("3M");
    const selectedDays =
        ranges.find((range) => range.label === selectedRange)?.days ?? 30;
    const rangeCandles = candles.slice(-selectedDays);

    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-blue-400" />
                    <h2 className="text-sm font-semibold text-slate-100">
                        Price chart
                    </h2>
                </div>
                <div className="flex gap-1 text-[10px] text-slate-600">
                    {ranges.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => setSelectedRange(range.label)}
                            className={
                                range.label === selectedRange
                                    ? "rounded bg-blue-600 px-2 py-1 text-white"
                                    : "rounded px-2 py-1 hover:bg-slate-800 hover:text-slate-300"
                            }
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="p-4">
                {isLoading ? (
                    <div className="h-64 animate-pulse rounded-md border border-slate-800/70 bg-[#10151b]" />
                ) : hasError ? (
                    <div className="flex h-64 items-center justify-center rounded-md border border-slate-800/70 bg-[#10151b] text-xs text-slate-500">
                        Candle data is unavailable.
                    </div>
                ) : candles.length === 0 ? (
                    <div className="flex h-64 items-center justify-center rounded-md border border-slate-800/70 bg-[#10151b] text-xs text-slate-500">
                        No historical candle data is available.
                    </div>
                ) : (
                    <CandlestickChart candles={rangeCandles} />
                )}
            </div>
        </section>
    );
};

const CandlestickChart = ({ candles }: { candles: Candle[] }) => {
    const validCandles = candles.filter((candle) =>
        [candle.open, candle.high, candle.low, candle.close].every(
            (value) => value !== null,
        ),
    );
    const [startIndex, setStartIndex] = useState(0);
    const dragStartX = useRef<number | null>(null);
    const dragStartIndex = useRef(0);
    if (validCandles.length === 0) return null;
    const visibleCount = Math.min(60, validCandles.length);
    const maximumStart = Math.max(0, validCandles.length - visibleCount);
    const safeStartIndex = Math.min(startIndex, maximumStart);
    const visibleCandles = validCandles.slice(
        safeStartIndex,
        safeStartIndex + visibleCount,
    );
    const values = visibleCandles.flatMap((candle) => [
        Number(candle.high),
        Number(candle.low),
    ]);
    const maximum = Math.max(...values);
    const minimum = Math.min(...values);
    const range = maximum - minimum || 1;
    const chartTop = 16;
    const chartBottom = 190;
    const width = 780;
    const step = width / visibleCandles.length;
    const scaleY = (value: number) =>
        chartBottom - ((value - minimum) / range) * (chartBottom - chartTop);
    const volumeValues = visibleCandles.map((candle) =>
        Number(candle.volume ?? 0),
    );
    const maximumVolume = Math.max(...volumeValues, 1);

    return (
        <div className="overflow-hidden rounded-md border border-slate-800/70 bg-[#10151b]">
            <svg
                viewBox="0 0 800 250"
                className="h-64 w-full cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
                onPointerDown={(event) => {
                    dragStartX.current = event.clientX;
                    dragStartIndex.current = safeStartIndex;
                    event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                    if (dragStartX.current === null || maximumStart === 0) {
                        return;
                    }
                    const pixelsPerCandle = 780 / visibleCount;
                    const candleDelta = Math.round(
                        (dragStartX.current - event.clientX) /
                            (event.currentTarget.clientWidth / 800) /
                            pixelsPerCandle,
                    );
                    setStartIndex(
                        Math.max(
                            0,
                            Math.min(
                                maximumStart,
                                dragStartIndex.current + candleDelta,
                            ),
                        ),
                    );
                }}
                onPointerUp={() => {
                    dragStartX.current = null;
                }}
                onPointerCancel={() => {
                    dragStartX.current = null;
                }}
                role="img"
                aria-label="Candlestick price chart"
            >
                {[0, 1, 2, 3].map((line) => (
                    <line
                        key={line}
                        x1="0"
                        x2="800"
                        y1={chartTop + line * 58}
                        y2={chartTop + line * 58}
                        stroke="#26313d"
                        strokeDasharray="3 4"
                    />
                ))}
                {visibleCandles.map((candle, index) => {
                    const open = Number(candle.open);
                    const close = Number(candle.close);
                    const high = Number(candle.high);
                    const low = Number(candle.low);
                    const x = index * step + step / 2;
                    const bodyTop = Math.min(scaleY(open), scaleY(close));
                    const bodyHeight = Math.max(
                        Math.abs(scaleY(open) - scaleY(close)),
                        2,
                    );
                    const color = close >= open ? "#10b981" : "#ef4444";
                    const volumeHeight =
                        (Number(candle.volume ?? 0) / maximumVolume) * 36;
                    return (
                        <g key={`${candle.date ?? "candle"}-${index}`}>
                            <line
                                x1={x}
                                x2={x}
                                y1={scaleY(high)}
                                y2={scaleY(low)}
                                stroke={color}
                                strokeWidth="1.5"
                            />
                            <rect
                                x={x - Math.max(step * 0.28, 2)}
                                y={bodyTop}
                                width={Math.max(step * 0.56, 4)}
                                height={bodyHeight}
                                fill={color}
                            />
                            <rect
                                x={x - Math.max(step * 0.28, 2)}
                                y={232 - volumeHeight}
                                width={Math.max(step * 0.56, 4)}
                                height={volumeHeight}
                                fill={color}
                                opacity="0.35"
                            />
                        </g>
                    );
                })}
            </svg>
            <div className="border-t border-slate-800 px-3 py-2 text-xs text-slate-500">
                Volume
            </div>
        </div>
    );
};

const OrderPanel = ({
    symbol,
    price,
    authenticated,
}: {
    symbol: string;
    price: string | null;
    authenticated: boolean;
}) => {
    const [side, setSide] = useState<"BUY" | "SELL">("BUY");
    const [quantity, setQuantity] = useState(0);
    const navigate = useNavigate();
    const walletQuery = useQuery({
        queryKey: ["wallet"],
        queryFn: Wallet,
        staleTime: 30_000,
        enabled: authenticated,
    });
    const orderMutation = useMutation({
        mutationFn: CreateOrder,
        onSuccess: (createdOrder) => {
            toast.success(
                `${createdOrder.side} order for ${createdOrder.symbol} was ${createdOrder.status.toLowerCase()}.`,
            );
        },
        onError: () => {
            toast.error("Order could not be placed. Please try again.");
        },
    });
    const total = quantity * Number(price ?? 0);

    return (
        <section className="rounded-lg border border-slate-800 bg-[#151a21] p-4">
            <div className="grid grid-cols-2 overflow-hidden rounded-md border border-slate-800 text-xs font-medium">
                <button
                    onClick={() => setSide("BUY")}
                    className={`px-3 py-2 ${side === "BUY" ? "bg-emerald-600 text-white" : "text-slate-600"}`}
                >
                    BUY
                </button>
                <button
                    onClick={() => setSide("SELL")}
                    className={`px-3 py-2 ${side === "SELL" ? "bg-red-600 text-white" : "text-slate-600"}`}
                >
                    SELL
                </button>
            </div>
            <label
                className="mt-4 block text-xs text-slate-500"
                htmlFor="order-quantity"
            >
                Quantity
            </label>
            <input
                id="order-quantity"
                type="number"
                min="0"
                value={quantity || ""}
                onChange={(event) =>
                    setQuantity(Math.max(0, Number(event.target.value)))
                }
                placeholder="0"
                className="mt-2 h-9 w-full rounded-md border border-slate-800 bg-[#1b222c] px-3 text-sm text-slate-600"
            />
            <div className="mt-5 flex justify-between text-xs text-slate-500">
                <span>Est. total</span>
                <span className="font-mono">Rs {total.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Available cash</span>
                <span className="font-mono">
                    {authenticated
                        ? `Rs ${Number(walletQuery.data?.virtual_balance ?? 0).toLocaleString("en-NP", { minimumFractionDigits: 2 })}`
                        : "Sign in required"}
                </span>
            </div>
            <button
                disabled={
                    !price ||
                    orderMutation.isPending ||
                    (authenticated && quantity < 1)
                }
                onClick={() => {
                    if (!authenticated) {
                        toast.info(
                            "You need to be authenticated to place an order.",
                        );
                        navigate("/login");
                        return;
                    }

                    orderMutation.mutate({ symbol, side, quantity });
                }}
                className={`mt-4 h-9 w-full rounded-md text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${side === "BUY" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-red-600 hover:bg-red-500"}`}
            >
                {orderMutation.isPending
                    ? "Placing order..."
                    : orderMutation.isSuccess
                      ? "Order placed"
                      : `Place ${side} Order`}
            </button>
        </section>
    );
};

const StockStatistics = ({
    stock,
    historyCount,
}: {
    stock: CompanyQuote;
    historyCount: number;
}) => {
    const positive = Number(stock.change) >= 0;
    return (
        <section className="rounded-lg border border-slate-800 bg-[#151a21] p-4">
            <h2 className="text-sm font-semibold text-slate-100">
                Stock statistics
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                <Metric label="Last traded price" value={`Rs ${stock.ltp}`} />
                <Metric label="Open" value={formatValue(stock.open)} />
                <Metric label="High" value={formatValue(stock.high)} />
                <Metric label="Low" value={formatValue(stock.low)} />
                <Metric
                    label="Previous close"
                    value={formatValue(stock.previous_close)}
                />
                <Metric label="Volume" value={formatValue(stock.volume)} />
                <Metric label="Turnover" value={formatValue(stock.turnover)} />
                <Metric
                    label="Transactions"
                    value={formatValue(stock.transactions)}
                />
                <Metric
                    label="Change"
                    value={`${positive ? "+" : ""}${stock.change}`}
                    tone={positive ? "positive" : "negative"}
                />
                <Metric
                    label="Change percentage"
                    value={`${positive ? "+" : ""}${stock.change_percent}%`}
                    tone={positive ? "positive" : "negative"}
                />
                <Metric label="Sector" value={stock.sector || "Unavailable"} />
                <Metric label="Change sessions" value={String(historyCount)} />
            </div>
        </section>
    );
};

const formatValue = (value: string | number | null) =>
    value === null || value === undefined ? "Unavailable" : String(value);

const Metric = ({
    label,
    value,
    tone = "neutral",
}: {
    label: string;
    value: string;
    tone?: "positive" | "negative" | "neutral";
}) => (
    <div className="min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-[#1b222c] p-3 sm:p-4">
        <p className="truncate text-xs text-slate-500">{label}</p>
        <p
            className={`mt-2 break-words font-mono text-base font-semibold leading-tight sm:text-lg ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-red-400" : "text-slate-100"}`}
        >
            {value}
        </p>
    </div>
);
const BackButton = ({ onBack }: { onBack: () => void }) => (
    <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"
    >
        <ArrowLeft size={16} />
        Back to stocks
    </button>
);
const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
        {children}
    </div>
);
const Loading = () => (
    <PageShell>
        <div className="h-72 animate-pulse rounded-lg border border-slate-800 bg-[#151a21]" />
    </PageShell>
);
const Message = ({ text }: { text: string }) => (
    <p className="rounded-lg border border-slate-800 bg-[#151a21] p-5 text-sm text-slate-500">
        {text}
    </p>
);

export default StockDetailPanel;
