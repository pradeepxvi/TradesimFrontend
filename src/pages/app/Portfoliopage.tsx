import { Check, BriefcaseBusiness, LoaderCircle, Plus, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { CreateOrder, Portfolio, Wallet } from "../../api/market";
import type { PortfolioHolding } from "../../types/market";
import { sumNumericValues, toFiniteNumber } from "../../utils/finance";

type OrderSide = "BUY" | "SELL";

const Portfoliopage = () => {
    const queryClient = useQueryClient();
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
            toast.success(
                `${createdOrder.side} order for ${createdOrder.symbol} was ${createdOrder.status.toLowerCase()}.`,
            );
        },
        onError: () => {
            toast.error("Order could not be placed. Please try again.");
        },
    });

    const holdings = portfolioQuery.data ?? [];
    const portfolioValue = sumNumericValues(
        holdings.map((holding) => holding.market_value),
    );
    const investedAmount = sumNumericValues(
        holdings.map((holding) => {
            const averagePrice = toFiniteNumber(holding.average_buy_price);
            return averagePrice === null
                ? null
                : averagePrice * holding.quantity;
        }),
    );
    const availableCash = toFiniteNumber(walletQuery.data?.virtual_balance);
    const totalProfitLoss = sumNumericValues(
        holdings.map((holding) => holding.unrealized_profit_loss),
    );
    const totalProfitPercent =
        investedAmount && totalProfitLoss !== null
            ? (totalProfitLoss / investedAmount) * 100
            : null;
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
                <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5 text-sm text-slate-300">
                    <p className="font-medium text-amber-300">
                        Unable to load your portfolio
                    </p>
                    <p className="mt-1 text-slate-400">
                        Please try again in a moment.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            void Promise.all([
                                portfolioQuery.refetch(),
                                walletQuery.refetch(),
                            ]);
                        }}
                        className="mt-3 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20"
                    >
                        Retry
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                            label="Unrealized P/L"
                            value={formatSignedAmount(totalProfitLoss)}
                            detail={
                                totalProfitPercent === null
                                    ? "N/A"
                                    : `${totalProfitPercent >= 0 ? "+" : ""}${totalProfitPercent.toFixed(2)}%`
                            }
                            tone={
                                totalProfitLoss === null
                                    ? "neutral"
                                    : totalProfitLoss >= 0
                                      ? "positive"
                                      : "negative"
                            }
                        />
                    </div>
                    <PortfolioChart holdings={holdings} />
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

export const PortfolioChart = ({
    holdings = [],
}: {
    holdings?: PortfolioHolding[];
}) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const svgWidth = 800;
    const svgHeight = 260;

    // Increased padding so labels and circles don't get cut off
    const padding = { top: 35, right: 30, bottom: 40, left: 65 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const safeHoldings = Array.isArray(holdings) ? holdings : [];

    const chartHoldings = safeHoldings.flatMap((holding) => {
        const value = toFiniteNumber(holding.market_value);
        return value === null ? [] : [{ holding, value }];
    });

    const values = chartHoldings.map(({ value }) => value);
    const maximum = Math.max(...values, 100);
    const minimum = Math.min(...values, 0);
    const valueRange = maximum - minimum || 1;

    const points = values.map((value, index) => {
        const x =
            values.length === 1
                ? padding.left + chartWidth / 2
                : padding.left + (index / (values.length - 1)) * chartWidth;
        const y =
            padding.top +
            chartHeight -
            ((value - minimum) / valueRange) * chartHeight;
        return { x, y, value };
    });

    const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

    // Closed polygon path for area fill
    const areaPoints = points.length
        ? `${padding.left},${padding.top + chartHeight} ${linePoints} ${
              padding.left + (values.length === 1 ? chartWidth / 2 : chartWidth)
          },${padding.top + chartHeight}`
        : "";

    return (
        <section className="overflow-hidden rounded-xl border border-slate-800 bg-[#151a21] shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-100">
                        Portfolio Value
                    </h2>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                        Current value by holding
                    </p>
                </div>
            </div>

            {points.length === 0 ? (
                <div className="flex h-64 items-center justify-center text-xs text-slate-500">
                    Add holdings with market value to see chart.
                </div>
            ) : (
                <div className="p-2 sm:p-4">
                    <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="h-64 sm:h-72 w-full overflow-visible"
                        role="img"
                        aria-label="Portfolio value by holding"
                    >
                        {/* Grid Lines & Y-Axis Value Labels */}
                        {[0, 0.33, 0.66, 1].map((ratio, index) => {
                            const y = padding.top + chartHeight * ratio;
                            const gridValue = maximum - valueRange * ratio;
                            return (
                                <g key={index}>
                                    <line
                                        x1={padding.left}
                                        x2={svgWidth - padding.right}
                                        y1={y}
                                        y2={y}
                                        stroke="#26313d"
                                        strokeDasharray="3 4"
                                    />
                                    <text
                                        x={padding.left - 8}
                                        y={y + 3}
                                        fill="#64748b"
                                        fontSize="10"
                                        textAnchor="end"
                                        className="font-mono"
                                    >
                                        {gridValue}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Area Fill */}
                        {areaPoints && (
                            <polygon
                                points={areaPoints}
                                fill="#2563eb"
                                opacity="0.12"
                            />
                        )}

                        {/* Chart Line */}
                        <polyline
                            points={linePoints}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />

                        {/* Data Points, Values & Symbols */}
                        {points.map((point, index) => {
                            const item = chartHoldings[index];
                            const isHovered = hoveredIndex === index;

                            return (
                                <g
                                    key={item.holding.symbol || index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="cursor-pointer transition-all"
                                >
                                    {/* Vertical guide line on hover */}
                                    {isHovered && (
                                        <line
                                            x1={point.x}
                                            x2={point.x}
                                            y1={padding.top}
                                            y2={padding.top + chartHeight}
                                            stroke="#3b82f6"
                                            strokeDasharray="2 2"
                                            opacity="0.5"
                                        />
                                    )}

                                    {/* Data Circle Point */}
                                    <circle
                                        cx={point.x}
                                        cy={point.y}
                                        r={isHovered ? "6" : "4.5"}
                                        fill="#151a21"
                                        stroke={
                                            isHovered ? "#60a5fa" : "#3b82f6"
                                        }
                                        strokeWidth={isHovered ? "3" : "2"}
                                    />

                                    {/* Always-Visible Value Label above point */}
                                    <text
                                        x={point.x}
                                        y={point.y - 10}
                                        textAnchor="middle"
                                        fill={isHovered ? "#93c5fd" : "#cbd5e1"}
                                        fontSize="10"
                                        fontWeight="600"
                                        className="font-mono transition-colors"
                                    >
                                        {point.value}
                                    </text>

                                    {/* Symbol Label below X-Axis */}
                                    <text
                                        x={point.x}
                                        y={svgHeight - 12}
                                        textAnchor="middle"
                                        fill={isHovered ? "#60a5fa" : "#64748b"}
                                        fontSize="11"
                                        fontWeight={isHovered ? "600" : "400"}
                                    >
                                        {item.holding.symbol}
                                    </text>
                                </g>
                            );
                        })}
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
                    const investedPrice = toFiniteNumber(
                        holding.average_buy_price,
                    );
                    const invested =
                        investedPrice === null
                            ? null
                            : investedPrice * holding.quantity;
                    const profitLoss = toFiniteNumber(
                        holding.unrealized_profit_loss,
                    );
                    const percent =
                        invested && profitLoss !== null
                            ? (profitLoss / invested) * 100
                            : null;
                    const positive = profitLoss !== null && profitLoss >= 0;
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
                                {formatAmount(
                                    toFiniteNumber(holding.market_value),
                                )}
                            </td>
                            <td
                                className={`px-4 py-3 font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                                {profitLoss === null
                                    ? "N/A"
                                    : `${positive ? "+" : "-"}${formatAmount(Math.abs(profitLoss))}`}
                            </td>
                            <td
                                className={`px-4 py-3 font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                                {percent === null
                                    ? "N/A"
                                    : `${positive ? "+" : ""}${percent.toFixed(2)}%`}
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

const formatAmount = (value: number | null) =>
    value === null
        ? "N/A"
        : `Rs ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatSignedAmount = (value: number | null) =>
    value === null
        ? "N/A"
        : `${value >= 0 ? "+" : "-"}${formatAmount(Math.abs(value))}`;

export default Portfoliopage;
