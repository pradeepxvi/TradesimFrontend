import {
    Check,
    LoaderCircle,
    Plus,
    ShoppingCart,
    Trash2,
    X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import {
    AddWatchlist,
    Companies,
    CreateOrder,
    RemoveWatchlist,
    Watchlist,
} from "../../api/market";
import type { Company, WatchlistItem } from "../../types/market";
import { Link } from "react-router-dom";

type OrderSide = "BUY" | "SELL";
type WatchlistRowData = Company & {
    volume?: number | string | null;
};

const Watchlistpage = () => {
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [symbolToAdd, setSymbolToAdd] = useState("");
    const [order, setOrder] = useState<{
        symbol: string;
        side: OrderSide;
    } | null>(null);
    const [quantity, setQuantity] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const watchlistQuery = useQuery({
        queryKey: ["watchlist"],
        queryFn: Watchlist,
        staleTime: 30_000,
    });
    const companiesQuery = useQuery({
        queryKey: ["companies"],
        queryFn: Companies,
        staleTime: 30_000,
    });
    const addMutation = useMutation({
        mutationFn: AddWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
            setIsAddOpen(false);
            setSymbolToAdd("");
            setMessage("Stock added to your watchlist.");
            toast.success("Stock added to your watchlist.");
        },
        onError: () => {
            toast.error("Could not add that stock to the watchlist.");
        },
    });
    const removeMutation = useMutation({
        mutationFn: RemoveWatchlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
            setMessage("Stock removed from your watchlist.");
            toast.success("Stock removed from your watchlist.");
        },
        onError: () => {
            toast.error("Could not remove that stock from the watchlist.");
        },
    });
    const orderMutation = useMutation({
        mutationFn: CreateOrder,
        onSuccess: (createdOrder) => {
            setOrder(null);
            setQuantity("");
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

    const watchlist = watchlistQuery.data ?? [];
    const companies = companiesQuery.data ?? [];
    const isLoading = watchlistQuery.isLoading || companiesQuery.isLoading;

    const submitAdd = () => {
        const symbol = symbolToAdd.trim().toUpperCase();
        if (!symbol) return;
        addMutation.mutate(symbol);
    };

    const submitOrder = () => {
        if (!order || Number(quantity) <= 0) return;
        orderMutation.mutate({
            symbol: order.symbol,
            side: order.side,
            quantity: Number(quantity),
        });
    };

    return (
        <div className="mobile-stack">
            <header className="surface-card rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-400">
                            Saved market view
                        </p>
                        <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                            Watchlist
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500"
                    >
                        <Plus size={14} />
                        Add Stock
                    </button>
                </div>
            </header>

            {message && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
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

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#151a21] shadow-2xl shadow-slate-950/20">
                {isLoading ? (
                    <div className="m-4 h-56 animate-pulse rounded-xl bg-slate-800/70" />
                ) : watchlistQuery.isError ? (
                    <p className="p-5 text-sm text-slate-500">
                        Watchlist information is unavailable right now.
                    </p>
                ) : watchlist.length === 0 ? (
                    <EmptyState onAdd={() => setIsAddOpen(true)} />
                ) : (
                    <WatchlistTable
                        items={watchlist}
                        companies={companies}
                        onBuy={(symbol) => setOrder({ symbol, side: "BUY" })}
                        onSell={(symbol) => setOrder({ symbol, side: "SELL" })}
                        onRemove={(symbol) => removeMutation.mutate(symbol)}
                        removingSymbol={
                            removeMutation.isPending
                                ? removeMutation.variables
                                : undefined
                        }
                    />
                )}
            </section>

            {isAddOpen && (
                <Dialog title="Add stock" onClose={() => setIsAddOpen(false)}>
                    <p className="text-xs text-slate-500">
                        Enter the exact trading symbol to save it to your
                        watchlist.
                    </p>
                    <input
                        autoFocus
                        value={symbolToAdd}
                        onChange={(event) => setSymbolToAdd(event.target.value)}
                        onKeyDown={(event) =>
                            event.key === "Enter" && submitAdd()
                        }
                        placeholder="e.g. NABIL"
                        className="mt-4 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm uppercase text-slate-200 outline-none focus:border-blue-500"
                    />
                    {addMutation.isError && (
                        <p className="mt-2 text-xs text-red-400">
                            Could not add that symbol. Check the symbol and try
                            again.
                        </p>
                    )}
                    <DialogActions
                        onCancel={() => setIsAddOpen(false)}
                        onSubmit={submitAdd}
                        submitLabel="Add Stock"
                        isPending={addMutation.isPending}
                    />
                </Dialog>
            )}

            {order && (
                <Dialog
                    title={`${order.side === "BUY" ? "Buy" : "Sell"} ${order.symbol}`}
                    onClose={() => setOrder(null)}
                >
                    <label
                        htmlFor="watchlist-quantity"
                        className="text-xs text-slate-500"
                    >
                        Quantity
                    </label>
                    <input
                        id="watchlist-quantity"
                        autoFocus
                        type="number"
                        min="1"
                        step="1"
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        placeholder="Enter quantity"
                        className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
                    />
                    {orderMutation.isError && (
                        <p className="mt-2 text-xs text-red-400">
                            The order could not be completed.
                        </p>
                    )}
                    <DialogActions
                        onCancel={() => setOrder(null)}
                        onSubmit={submitOrder}
                        submitLabel={order.side === "BUY" ? "Buy" : "Sell"}
                        isPending={orderMutation.isPending}
                        danger={order.side === "SELL"}
                    />
                </Dialog>
            )}
        </div>
    );
};

const WatchlistTable = ({
    items,
    companies,
    onBuy,
    onSell,
    onRemove,
    removingSymbol,
}: {
    items: WatchlistItem[];
    companies: Company[];
    onBuy: (symbol: string) => void;
    onSell: (symbol: string) => void;
    onRemove: (symbol: string) => void;
    removingSymbol?: string;
}) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs">
            <thead className="border-b border-slate-800 bg-[#1b222c] text-slate-500">
                <tr>
                    {[
                        "Symbol",
                        "Company",
                        "Sector",
                        "Price",
                        "Change",
                        "% Change",
                        "Volume",
                        "Actions",
                    ].map((heading) => (
                        <th key={heading} className="px-4 py-3 font-medium">
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {items.map((item) => {
                    const stock = findStock(item, companies);
                    const positive = Number(stock.change ?? 0) >= 0;
                    return (
                        <tr key={item.id} className="hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono font-semibold text-blue-400">
                                <Link
                                    to={`/stocks/${encodeURIComponent(item.symbol)}`}
                                >
                                    {item.symbol}
                                </Link>
                            </td>
                            <td className="max-w-56 truncate px-4 py-3 text-slate-300">
                                {stock.name ?? item.symbol}
                            </td>
                            <td className="px-4 py-3 text-slate-500">
                                {stock.sector ?? "-"}
                            </td>
                            <td className="px-4 py-3 font-mono font-semibold text-slate-200">
                                Rs {stock.ltp ?? "-"}
                            </td>
                            <td
                                className={`px-4 py-3 font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                                {formatSigned(stock.change)}
                            </td>
                            <td
                                className={`px-4 py-3 font-mono ${positive ? "text-emerald-400" : "text-red-400"}`}
                            >
                                {formatPercent(stock.change_percent)}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500">
                                {stock.volume ?? "-"}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => onBuy(item.symbol)}
                                        className="rounded-md bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-500"
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => onSell(item.symbol)}
                                        className="rounded-md bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-500"
                                    >
                                        Sell
                                    </button>
                                    <button
                                        aria-label={`Remove ${item.symbol}`}
                                        disabled={
                                            removingSymbol === item.symbol
                                        }
                                        onClick={() => onRemove(item.symbol)}
                                        className="p-2 text-red-500 hover:text-red-400 disabled:opacity-50"
                                    >
                                        {removingSymbol === item.symbol ? (
                                            <LoaderCircle
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Trash2 size={14} />
                                        )}
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

const findStock = (
    item: WatchlistItem,
    companies: Company[],
): WatchlistRowData => {
    const company = companies.find(
        (entry) => entry.symbol.toUpperCase() === item.symbol.toUpperCase(),
    );
    const market = item.market as Partial<Company>;
    return {
        symbol: item.symbol,
        name: company?.name ?? market.name ?? item.symbol,
        sector: company?.sector ?? market.sector ?? null,
        ltp: company?.ltp ?? market.ltp ?? null,
        change: company?.change ?? market.change ?? null,
        change_percent:
            company?.change_percent ?? market.change_percent ?? null,
        volume:
            (company as WatchlistRowData | undefined)?.volume ??
            (market as Partial<WatchlistRowData>).volume ??
            null,
    };
};

const formatSigned = (value: string | null) => {
    if (value === null) return "-";
    return `${Number(value) >= 0 ? "+" : ""}${value}`;
};

const formatPercent = (value: string | null) => {
    if (value === null) return "-";
    return `${Number(value) >= 0 ? "+" : ""}${value}%`;
};

const EmptyState = ({ onAdd }: { onAdd: () => void }) => (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <ShoppingCart size={24} className="text-slate-600" />
        <h2 className="mt-3 text-sm font-semibold text-slate-200">
            Your watchlist is empty
        </h2>
        <p className="mt-1 text-xs text-slate-500">
            Save stocks here to track their market movement.
        </p>
        <button
            onClick={onAdd}
            className="mt-4 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
        >
            Add your first stock
        </button>
    </div>
);

const Dialog = ({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-[#151a21] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <button
                    aria-label="Close dialog"
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-200"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="mt-4">{children}</div>
        </div>
    </div>
);

const DialogActions = ({
    onCancel,
    onSubmit,
    submitLabel,
    isPending,
    danger = false,
}: {
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
    isPending: boolean;
    danger?: boolean;
}) => (
    <div className="mt-5 flex justify-end gap-2">
        <button
            onClick={onCancel}
            className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400 hover:text-slate-200"
        >
            Cancel
        </button>
        <button
            onClick={onSubmit}
            disabled={isPending}
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-white disabled:opacity-50 ${danger ? "bg-red-600 hover:bg-red-500" : "bg-blue-600 hover:bg-blue-500"}`}
        >
            {isPending && <LoaderCircle size={13} className="animate-spin" />}
            {submitLabel}
        </button>
    </div>
);

export default Watchlistpage;
