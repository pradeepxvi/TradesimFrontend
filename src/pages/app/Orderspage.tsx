import { Check, Eye, LoaderCircle, Plus, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { CancelOrder, CreateOrder, Orders } from "../../api/market";
import type { Order, OrderCreate } from "../../types/market";
import { Link } from "react-router-dom";

type OrderFilter = "ALL" | "OPEN" | "COMPLETED" | "CANCELLED" | "REJECTED";
type OrderSide = "BUY" | "SELL";

const Orderspage = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<OrderFilter>("ALL");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const ordersQuery = useQuery({
        queryKey: ["orders"],
        queryFn: Orders,
        staleTime: 30_000,
    });
    const cancelMutation = useMutation({
        mutationFn: CancelOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setMessage("Order cancelled successfully.");
            toast.success("Order cancelled successfully.");
        },
        onError: () => {
            toast.error("Could not cancel this order.");
        },
    });
    const createMutation = useMutation({
        mutationFn: CreateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setIsNewOrderOpen(false);
            setMessage("New order created successfully.");
            toast.success("New order created successfully.");
        },
        onError: () => {
            toast.error("Could not create the order.");
        },
    });

    const orders = ordersQuery.data ?? [];
    const filteredOrders = orders.filter((order) =>
        filter === "ALL" ? true : normalizeStatus(order.status) === filter,
    );

    return (
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                        Trading activity
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-white">
                        Orders
                    </h1>
                </div>
                <button
                    onClick={() => setIsNewOrderOpen(true)}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                >
                    <Plus size={14} />
                    New Order
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

            <div className="flex w-fit flex-wrap gap-1 rounded-lg border border-slate-800 bg-[#151a21] p-1">
                {(
                    [
                        "ALL",
                        "OPEN",
                        "COMPLETED",
                        "CANCELLED",
                        "REJECTED",
                    ] as OrderFilter[]
                ).map((item) => {
                    const count =
                        item === "ALL"
                            ? orders.length
                            : orders.filter(
                                  (order) =>
                                      normalizeStatus(order.status) === item,
                              ).length;
                    return (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`rounded-md px-3 py-2 text-xs ${filter === item ? "bg-[#1b222c] text-slate-100" : "text-slate-500 hover:text-slate-300"}`}
                        >
                            {formatFilter(item)} ({count})
                        </button>
                    );
                })}
            </div>

            <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
                {ordersQuery.isLoading ? (
                    <div className="m-4 h-56 animate-pulse rounded-md bg-slate-800/70" />
                ) : ordersQuery.isError ? (
                    <p className="p-5 text-sm text-slate-500">
                        Order information is unavailable right now.
                    </p>
                ) : filteredOrders.length === 0 ? (
                    <p className="p-12 text-center text-sm text-slate-500">
                        No{" "}
                        {filter === "ALL"
                            ? "orders"
                            : `${formatFilter(filter).toLowerCase()} orders`}{" "}
                        found.
                    </p>
                ) : (
                    <OrdersTable
                        orders={filteredOrders}
                        onDetails={setSelectedOrder}
                        onCancel={(id) => cancelMutation.mutate(id)}
                        cancellingId={
                            cancelMutation.isPending
                                ? cancelMutation.variables
                                : undefined
                        }
                    />
                )}
            </section>

            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
            {isNewOrderOpen && (
                <NewOrderDialog
                    onClose={() => setIsNewOrderOpen(false)}
                    onSubmit={(data) => createMutation.mutate(data)}
                    isPending={createMutation.isPending}
                    hasError={createMutation.isError}
                />
            )}
        </div>
    );
};

const OrdersTable = ({
    orders,
    onDetails,
    onCancel,
    cancellingId,
}: {
    orders: Order[];
    onDetails: (order: Order) => void;
    onCancel: (id: number) => void;
    cancellingId?: number;
}) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-xs">
            <thead className="border-b border-slate-800 bg-[#1b222c] text-slate-500">
                <tr>
                    {[
                        "Order ID",
                        "Symbol",
                        "Side",
                        "Qty",
                        "Price",
                        "Filled",
                        "Total",
                        "Status",
                        "Created",
                        "Actions",
                    ].map((heading) => (
                        <th key={heading} className="px-4 py-3 font-medium">
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {orders.map((order) => {
                    const status = normalizeStatus(order.status);
                    const open = status === "OPEN";
                    return (
                        <tr key={order.id} className="hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono text-slate-500">
                                ORD-{String(order.id).padStart(3, "0")}
                            </td>
                            <td className="px-4 py-3">
                                <p className="font-mono font-semibold text-blue-400">
                                    <Link
                                        to={`/stocks/${encodeURIComponent(order.symbol)}`}
                                    >
                                        {order.symbol}
                                    </Link>
                                </p>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`rounded px-2 py-1 text-[10px] font-semibold ${order.side === "BUY" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                                >
                                    {order.side}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-300">
                                {order.quantity}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-200">
                                {formatAmount(Number(order.price))}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-500">
                                {status === "EXECUTED" || status === "COMPLETED"
                                    ? order.quantity
                                    : 0}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-200">
                                {formatAmount(Number(order.total_amount))}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={status} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                {formatDate(order.created_at)}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => onDetails(order)}
                                        className="flex items-center gap-1 text-slate-300 hover:text-white"
                                    >
                                        <Eye size={14} />
                                        Details
                                    </button>
                                    {open && (
                                        <button
                                            disabled={cancellingId === order.id}
                                            onClick={() => onCancel(order.id)}
                                            className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-500 disabled:opacity-50"
                                        >
                                            {cancellingId === order.id ? (
                                                <LoaderCircle
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                "Cancel"
                                            )}
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => (
    <span
        className={`rounded-md border px-2 py-1 text-[10px] font-medium ${status === "COMPLETED" || status === "EXECUTED" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : status === "OPEN" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : status === "REJECTED" ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-slate-700 bg-slate-800 text-slate-500"}`}
    >
        {status === "EXECUTED"
            ? "Completed"
            : formatFilter(status as OrderFilter)}
    </span>
);

const OrderDetails = ({
    order,
    onClose,
}: {
    order: Order;
    onClose: () => void;
}) => (
    <Dialog title="Order Details" onClose={onClose}>
        <div className="grid grid-cols-2 gap-3">
            {[
                ["Order ID", `ORD-${String(order.id).padStart(3, "0")}`],
                ["Symbol", order.symbol],
                ["Side", order.side],
                ["Quantity", String(order.quantity)],
                ["Price", formatAmount(Number(order.price))],
                ["Total", formatAmount(Number(order.total_amount))],
                ["Status", order.status],
                ["Created", formatDate(order.created_at)],
            ].map(([label, value]) => (
                <div
                    key={label}
                    className="rounded-md border border-slate-800 bg-[#10151b] p-3"
                >
                    <p className="text-[11px] text-slate-500">{label}</p>
                    <p className="mt-1 text-sm text-slate-200">{value}</p>
                </div>
            ))}
        </div>
    </Dialog>
);

const NewOrderDialog = ({
    onClose,
    onSubmit,
    isPending,
    hasError,
}: {
    onClose: () => void;
    onSubmit: (data: OrderCreate) => void;
    isPending: boolean;
    hasError: boolean;
}) => {
    const [symbol, setSymbol] = useState("");
    const [side, setSide] = useState<OrderSide>("BUY");
    const [quantity, setQuantity] = useState("");
    return (
        <Dialog title="New Order" onClose={onClose}>
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => setSide("BUY")}
                    className={`rounded-md px-3 py-2 text-xs ${side === "BUY" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-500"}`}
                >
                    BUY
                </button>
                <button
                    onClick={() => setSide("SELL")}
                    className={`rounded-md px-3 py-2 text-xs ${side === "SELL" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-500"}`}
                >
                    SELL
                </button>
            </div>
            <label
                htmlFor="new-order-symbol"
                className="mt-4 block text-xs text-slate-500"
            >
                Symbol
            </label>
            <input
                id="new-order-symbol"
                autoFocus
                value={symbol}
                onChange={(event) =>
                    setSymbol(event.target.value.toUpperCase())
                }
                placeholder="e.g. NABIL"
                className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm uppercase text-slate-200 outline-none focus:border-blue-500"
            />
            <label
                htmlFor="new-order-quantity"
                className="mt-4 block text-xs text-slate-500"
            >
                Quantity
            </label>
            <input
                id="new-order-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter quantity"
                className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-[#10151b] px-3 text-sm text-slate-200 outline-none focus:border-blue-500"
            />
            {hasError && (
                <p className="mt-2 text-xs text-red-400">
                    The order could not be created.
                </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-400"
                >
                    Cancel
                </button>
                <button
                    disabled={isPending || !symbol || Number(quantity) < 1}
                    onClick={() =>
                        onSubmit({ symbol, side, quantity: Number(quantity) })
                    }
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-medium text-white disabled:opacity-50"
                >
                    {isPending && (
                        <LoaderCircle size={13} className="animate-spin" />
                    )}
                    Place Order
                </button>
            </div>
        </Dialog>
    );
};

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
        <div className="w-full max-w-lg rounded-lg border border-slate-700 bg-[#151a21] p-5 shadow-2xl">
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

const normalizeStatus = (status: string) =>
    status.toUpperCase() === "EXECUTED" ? "COMPLETED" : status.toUpperCase();
const formatFilter = (value: OrderFilter | string) =>
    value.charAt(0) + value.slice(1).toLowerCase();
const formatAmount = (value: number) =>
    `Rs ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-NP", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

export default Orderspage;
