import { Check, BriefcaseBusiness, LoaderCircle, Plus, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { CreateOrder, Portfolio, Wallet } from "../../api/market";
import type { PortfolioHolding } from "../../types/market";

type OrderSide = "BUY" | "SELL";

const Portfoliopage = () => {
    const queryClient = useQueryClient();
    const [range, setRange] = useState("1M");
    const [order, setOrder] = useState<{
        symbol: string;
        side: OrderSide;
    } | null>(null);
    const [quantity, setQuantity] = useState("");
    const [symbol, setSymbol] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const portfolioQuery = useQuery({
        queryKey: ["portfolio"],
        queryFn: Portfolio,
        staleTime: 30_000,
    });
    const walletQuery = useQuery({
        queryKey: ["wallet"],
        queryFn: Wallet,
        staleTime: 30_000,
    });
    const orderMutation = useMutation({
        mutationFn: CreateOrder,
        onSuccess: (createdOrder) => {
            queryClient.invalidateQueries({ queryKey: ["portfolio"] });
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
            setOrder(null);
            setQuantity("");
            setSymbol("");
            setMessage(
                `${createdOrder.side} order for ${createdOrder.symbol} was ${createdOrder.status.toLowerCase()}.`,
            );
        },
    });

    const holdings = portfolioQuery.data ?? [];
    const portfolioValue = holdings.reduce(
        (total, holding) => total + Number(holding.market_value || 0),
        0,
    );
    const investedAmount = holdings.reduce(
        (total, holding) =>
            total + Number(holding.average_buy_price || 0) * holding.quantity,
        0,
    );
    const availableCash = Number(walletQuery.data?.virtual_balance ?? 0);
    const totalProfitLoss = holdings.reduce(
        (total, holding) => total + Number(holding.unrealized_profit_loss || 0),
        0,
    );
    const totalProfitPercent = investedAmount
        ? (totalProfitLoss / investedAmount) * 100
        : 0;
    const isLoading = portfolioQuery.isLoading || walletQuery.isLoading;
    const hasError = portfolioQuery.isError || walletQuery.isError;

    const submitOrder = () => {
        if (!order || !order.symbol || Number(quantity) <= 0) return;
        orderMutation.mutate({
            symbol: order.symbol,
            side: order.side,
            quantity: Number(quantity),
        });
    };

    return (
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                        Trading account
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-white">
                        Portfolio
                    </h1>
                </div>
                <button
                    onClick={() => setOrder({ symbol: "", side: "BUY" })}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                >
                    <Plus size={14} />
                    Buy Stock
                </button>
            </div>
            {message && (
                <div className="flex items-center justify-between rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
                    <span className="flex items-center gap-2">
                        <Check size={14} />
                        {message}
                    </span>
                    <button
                        aria-label="Dismiss message"
                        onClick={() => setMessage(null)}
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
            {isLoading ? (
                <div className="h-40 animate-pulse rounded-lg border border-slate-800 bg-[#151a21]" />
            ) : hasError ? (
                <p className="rounded-lg border border-slate-800 bg-[#151a21] p-5 text-sm text-slate-500">
                    Portfolio information is unavailable right now.
                </p>
            ) : (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <MetricCard
                            label="Portfolio Value"
                            value={formatAmount(portfolioValue)}
                        />
                        <MetricCard
                            label="Invested Amount"
                            value={formatAmount(investedAmount)}
                        />
                        <MetricCard
                            label="Available Cash"
                            value={formatAmount(availableCash)}
                        />
                        <MetricCard
                            label="Total P/L"
                            value={`${totalProfitLoss >= 0 ? "+" : "-"}${formatAmount(Math.abs(totalProfitLoss))}`}
                            detail={`${totalProfitPercent >= 0 ? "+" : ""}${totalProfitPercent.toFixed(2)}%`}
                            tone={
                                totalProfitLoss >= 0 ? "positive" : "negative"
                            }
                        />
                        <MetricCard
                            label="Today's P/L"
                            value="-"
                            detail="History unavailable"
                        />
                    </div>
                    <PortfolioChart
                        holdings={holdings}
                        range={range}
                        onRangeChange={setRange}
                    />
                    <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
                        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                            <BriefcaseBusiness
                                size={16}
                                className="text-blue-400"
                            />
                            <h2 className="text-sm font-semibold text-slate-100">
                                Holdings ({holdings.length})
                            </h2>
                        </div>
                        {holdings.length === 0 ? (
                            <div className="px-5 py-14 text-center text-sm text-slate-500">
                                You do not hold any stocks yet.
                            </div>
                        ) : (
                            <HoldingsTable
                                holdings={holdings}
                                onBuy={(stockSymbol) =>
                                    setOrder({
                                        symbol: stockSymbol,
                                        side: "BUY",
                                    })
                                }
                                onSell={(stockSymbol) =>
                                    setOrder({
                                        symbol: stockSymbol,
                                        side: "SELL",
                                    })
                                }
                            />
                        )}
                    </section>
                </>
            )}
            {order && (
                <OrderDialog
                    order={order}
                    quantity={quantity}
                    symbol={symbol}
                    setQuantity={setQuantity}
                    setSymbol={(value) => {
                        setSymbol(value);
                        setOrder((current) =>
                            current ? { ...current, symbol: value } : current,
                        );
                    }}
                    onClose={() => setOrder(null)}
                    onSubmit={submitOrder}
                    isPending={orderMutation.isPending}
                    hasError={orderMutation.isError}
                />
            )}
        </div>
    );
};

const MetricCard = ({
    label,
    value,
    detail,
    tone = "neutral",
}: {
    label: string;
    value: string;
    detail?: string;
    tone?: "neutral" | "positive" | "negative";
}) => (
    <div className="rounded-lg border border-slate-800 bg-[#151a21] p-4">
        <p className="text-xs text-slate-500">{label}</p>
        <p
            className={`mt-2 truncate font-mono text-sm font-semibold ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-red-400" : "text-slate-100"}`}
        >
            {value}
        </p>
        {detail && (
            <p
                className={`mt-1 font-mono text-[11px] ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-red-400" : "text-slate-600"}`}
            >
                {detail}
            </p>
        )}
    </div>
);

const PortfolioChart = ({
    holdings,
    range,
    onRangeChange,
}: {
    holdings: PortfolioHolding[];
    range: string;
    onRangeChange: (value: string) => void;
}) => {
    const width = 800;
    const chartTop = 18;
    const chartBottom = 190;
    const values = holdings.map((holding) => Number(holding.market_value || 0));
    const maximum = Math.max(...values, 1);
    const minimum = Math.min(...values, 0);
    const valueRange = maximum - minimum || 1;
    const points = values.map((value, index) => ({
        x:
            values.length === 1
                ? width / 2
                : (index / (values.length - 1)) * width,
        y:
            chartBottom -
            ((value - minimum) / valueRange) * (chartBottom - chartTop),
    }));
    const line = points.map((point) => `${point.x},${point.y}`).join(" ");
    const area = points.length
        ? `0,${chartBottom} ${line} ${width},${chartBottom}`
        : "";
    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-100">
                        Portfolio Value
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-600">
                        Current value by holding
                    </p>
                </div>
                <div className="flex gap-1 text-[10px] text-slate-500">
                    {["1W", "1M", "3M", "6M", "1Y"].map((item) => (
                        <button
                            key={item}
                            onClick={() => onRangeChange(item)}
                            className={`rounded px-2 py-1 ${range === item ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-slate-300"}`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>
            {points.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-xs text-slate-500">
                    Add holdings to see portfolio value.
                </div>
            ) : (
                <div className="p-4">
                    <svg
                        viewBox="0 0 800 230"
                        className="h-64 w-full"
                        role="img"
                        aria-label="Portfolio value by holding"
                    >
                        {[0, 1, 2, 3].map((lineIndex) => (
                            <line
                                key={lineIndex}
                                x1="0"
                                x2={width}
                                y1={chartTop + lineIndex * 57}
                                y2={chartTop + lineIndex * 57}
                                stroke="#26313d"
                                strokeDasharray="3 4"
                            />
                        ))}
                        <polygon points={area} fill="#2563eb" opacity="0.12" />
                        <polyline
                            points={line}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                        {points.map((point, index) => (
                            <g key={holdings[index].symbol}>
                                <circle
                                    cx={point.x}
                                    cy={point.y}
                                    r="4"
                                    fill="#151a21"
                                    stroke="#60a5fa"
                                    strokeWidth="2"
                                />
                                <text
                                    x={point.x}
                                    y="215"
                                    textAnchor="middle"
                                    fill="#64748b"
                                    fontSize="10"
                                >
                                    {holdings[index].symbol}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>
            )}
        </section>
    );
};

const HoldingsTable = ({
    holdings,
    onBuy,
    onSell,
}: {
    holdings: PortfolioHolding[];
    onBuy: (symbol: string) => void;
    onSell: (symbol: string) => void;
}) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="border-b border-slate-800 bg-[#1b222c] text-slate-500">
                <tr>
                    {[
                        "Symbol",
                        "Company",
                        "Qty",
                        "Avg Price",
                        "Current Price",
                        "Invested",
                        "Market Value",
                        "P/L",
                        "P/L %",
                        "Actions",
                    ].map((heading) => (
                        <th key={heading} className="px-4 py-3 font-medium">
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {holdings.map((holding) => {
                    const invested =
                        Number(holding.average_buy_price) * holding.quantity;
                    const profitLoss = Number(
                        holding.unrealized_profit_loss || 0,
                    );
                    const percent = invested
                        ? (profitLoss / invested) * 100
                        : 0;
                    const positive = profitLoss >= 0;
                    return (
                        <tr
                            key={holding.symbol}
                            className="hover:bg-slate-800/40"
                        >
                            <td className="px-4 py-3 font-mono font-semibold text-blue-400">
                                <Link
                                    to={`/stocks/${encodeURIComponent(holding.symbol)}`}
                                    className="hover:text-blue-300"
                                >
                                    {holding.symbol}
                                </Link>
                            </td>
                            <td className="max-w-52 truncate px-4 py-3 text-slate-300">
                                {holding.company_name}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-300">
                                {holding.quantity}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500">
                                {formatAmount(
                                    Number(holding.average_buy_price),
                                )}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                                {formatAmount(Number(holding.current_price))}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500">
                                {formatAmount(invested)}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-200">
                                {formatAmount(Number(holding.market_value))}
                            </td>
                            <td
                                className={`px-4 py-3 font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                                {positive ? "+" : "-"}
                                {formatAmount(Math.abs(profitLoss))}
                            </td>
                            <td
                                className={`px-4 py-3 font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                                {positive ? "+" : ""}
                                {percent.toFixed(2)}%
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => onBuy(holding.symbol)}
                                        className="rounded-md bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-500"
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => onSell(holding.symbol)}
                                        className="rounded-md bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-500"
                                    >
                                        Sell
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const OrderDialog = ({
    order,
    quantity,
    symbol,
    setQuantity,
    setSymbol,
    onClose,
    onSubmit,
    isPending,
    hasError,
}: {
    order: { symbol: string; side: OrderSide };
    quantity: string;
    symbol: string;
    setQuantity: (value: string) => void;
    setSymbol: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
    isPending: boolean;
    hasError: boolean;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-[#151a21] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">
                    {order.side === "BUY"
                        ? "Buy Stock"
                        : `Sell ${order.symbol}`}
                </h2>
                <button
                    aria-label="Close dialog"
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-200"
                >
                    <X size={18} />
                </button>
            </div>
            {order.side === "BUY" && (
                <>
                    <label
                        htmlFor="portfolio-symbol"
                        className="mt-4 block text-xs text-slate-500"
                    >
                        Symbol
                    </label>
                    <input
                        id="portfolio-symbol"
                        autoFocus
                        value={symbol}
                        onChange={(event) =>
                            setSymbol(event.target.value.toUpperCase())
                        }
                        placeholder="e.g. NABIL"
                        className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm uppercase text-slate-200 outline-none focus:border-blue-500"
                    />
                </>
            )}
            <label
                htmlFor="portfolio-quantity"
                className="mt-4 block text-xs text-slate-500"
            >
                Quantity
            </label>
            <input
                id="portfolio-quantity"
                autoFocus={order.side === "SELL"}
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter quantity"
                className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
            {hasError && (
                <p className="mt-2 text-xs text-red-400">
                    The order could not be completed.
                </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isPending || !order.symbol}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-white disabled:opacity-50 ${order.side === "SELL" ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"}`}
                >
                    {isPending && (
                        <LoaderCircle size={13} className="animate-spin" />
                    )}
                    {order.side === "BUY" ? "Buy" : "Sell"}
                </button>
            </div>
        </div>
    </div>
);

const formatAmount = (value: number) =>
    `Rs ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default Portfoliopage;
