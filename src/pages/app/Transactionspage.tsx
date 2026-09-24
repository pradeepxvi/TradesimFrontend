import { ArrowDownLeft, ArrowUpRight, Eye, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Orders } from "../../api/market";
import type { Order } from "../../types/market";

type TransactionFilter = "ALL" | "BUY" | "SELL" | "COMPLETED" | "REJECTED";

const Transactionspage = () => {
    const [filter, setFilter] = useState<TransactionFilter>("ALL");
    const [selectedTransaction, setSelectedTransaction] =
        useState<Order | null>(null);
    const transactionsQuery = useQuery({
        queryKey: ["transactions"],
        queryFn: Orders,
        staleTime: 30_000,
    });
    const transactions = transactionsQuery.data ?? [];
    const filteredTransactions = transactions.filter((transaction) => {
        if (filter === "ALL") return true;
        if (filter === "BUY" || filter === "SELL")
            return transaction.side === filter;
        return normalizeStatus(transaction.status) === filter;
    });
    const totalVolume = transactions.reduce(
        (total, transaction) => total + Number(transaction.total_amount || 0),
        0,
    );
    const completed = transactions.filter(
        (transaction) => normalizeStatus(transaction.status) === "COMPLETED",
    );
    const completedVolume = completed.reduce(
        (total, transaction) => total + Number(transaction.total_amount || 0),
        0,
    );

    return (
        <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-5 lg:p-6">
            <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-400">
                    Account activity
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-white">
                    Transactions
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review executed and submitted trading activity.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <SummaryCard
                    label="Total transactions"
                    value={String(transactions.length)}
                />
                <SummaryCard
                    label="Completed transactions"
                    value={String(completed.length)}
                    tone="positive"
                />
                <SummaryCard
                    label="Completed volume"
                    value={formatAmount(completedVolume || totalVolume)}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {(
                    [
                        "ALL",
                        "BUY",
                        "SELL",
                        "COMPLETED",
                        "REJECTED",
                    ] as TransactionFilter[]
                ).map((item) => {
                    const count =
                        item === "ALL"
                            ? transactions.length
                            : transactions.filter((transaction) =>
                                  item === "BUY" || item === "SELL"
                                      ? transaction.side === item
                                      : normalizeStatus(transaction.status) ===
                                        item,
                              ).length;
                    return (
                        <button
                            key={item}
                            onClick={() => setFilter(item)}
                            className={`rounded-md px-3 py-2 text-xs ${filter === item ? "bg-blue-600 text-white" : "border border-slate-800 bg-[#151a21] text-slate-500 hover:text-slate-300"}`}
                        >
                            {formatFilter(item)} ({count})
                        </button>
                    );
                })}
            </div>

            <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
                {transactionsQuery.isLoading ? (
                    <div className="m-4 h-56 animate-pulse rounded-md bg-slate-800/70" />
                ) : transactionsQuery.isError ? (
                    <p className="p-5 text-sm text-slate-500">
                        Transaction information is unavailable right now.
                    </p>
                ) : filteredTransactions.length === 0 ? (
                    <p className="p-12 text-center text-sm text-slate-500">
                        No transactions found.
                    </p>
                ) : (
                    <TransactionsTable
                        transactions={filteredTransactions}
                        onDetails={setSelectedTransaction}
                    />
                )}
            </section>

            {selectedTransaction && (
                <TransactionDetails
                    transaction={selectedTransaction}
                    onClose={() => setSelectedTransaction(null)}
                />
            )}
        </div>
    );
};

const SummaryCard = ({
    label,
    value,
    tone = "neutral",
}: {
    label: string;
    value: string;
    tone?: "neutral" | "positive";
}) => (
    <div className="rounded-lg border border-slate-800 bg-[#151a21] p-4">
        <p className="text-xs text-slate-500">{label}</p>
        <p
            className={`mt-2 font-mono text-xl font-semibold ${tone === "positive" ? "text-emerald-400" : "text-slate-100"}`}
        >
            {value}
        </p>
    </div>
);

const TransactionsTable = ({
    transactions,
    onDetails,
}: {
    transactions: Order[];
    onDetails: (transaction: Order) => void;
}) => (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-slate-800 bg-[#1b222c] text-slate-500">
                <tr>
                    {[
                        "Transaction ID",
                        "Symbol",
                        "Type",
                        "Quantity",
                        "Price",
                        "Total",
                        "Status",
                        "Date",
                        "Actions",
                    ].map((heading) => (
                        <th key={heading} className="px-4 py-3 font-medium">
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {transactions.map((transaction) => {
                    const completed =
                        normalizeStatus(transaction.status) === "COMPLETED";
                    return (
                        <tr
                            key={transaction.id}
                            className="hover:bg-slate-800/40"
                        >
                            <td className="px-4 py-3 font-mono text-slate-500">
                                TXN-{String(transaction.id).padStart(3, "0")}
                            </td>
                            <td className="px-4 py-3">
                                <Link
                                    to={`/stocks/${encodeURIComponent(transaction.symbol)}`}
                                    className="font-mono font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    {transaction.symbol}
                                </Link>
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`flex w-fit items-center gap-1 rounded px-2 py-1 text-[10px] font-semibold ${transaction.side === "BUY" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
                                >
                                    {transaction.side === "BUY" ? (
                                        <ArrowDownLeft size={11} />
                                    ) : (
                                        <ArrowUpRight size={11} />
                                    )}
                                    {transaction.side}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-300">
                                {transaction.quantity}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-200">
                                {formatAmount(Number(transaction.price))}
                            </td>
                            <td className="px-4 py-3 font-mono text-slate-200">
                                {formatAmount(Number(transaction.total_amount))}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={`rounded-md border px-2 py-1 text-[10px] ${completed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}
                                >
                                    {completed
                                        ? "Completed"
                                        : formatFilter(transaction.status)}
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                                {formatDate(transaction.created_at)}
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => onDetails(transaction)}
                                    className="flex items-center gap-1 text-slate-300 hover:text-white"
                                >
                                    <Eye size={14} />
                                    Details
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

const TransactionDetails = ({
    transaction,
    onClose,
}: {
    transaction: Order;
    onClose: () => void;
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="w-full max-w-lg rounded-lg border border-slate-700 bg-[#151a21] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">
                    Transaction Details
                </h2>
                <button
                    aria-label="Close dialog"
                    onClick={onClose}
                    className="text-slate-500 hover:text-slate-200"
                >
                    <X size={18} />
                </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                    [
                        "Transaction ID",
                        `TXN-${String(transaction.id).padStart(3, "0")}`,
                    ],
                    ["Symbol", transaction.symbol],
                    ["Type", transaction.side],
                    ["Quantity", String(transaction.quantity)],
                    ["Price", formatAmount(Number(transaction.price))],
                    ["Total", formatAmount(Number(transaction.total_amount))],
                    ["Status", normalizeStatus(transaction.status)],
                    ["Date", formatDate(transaction.created_at)],
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
        </div>
    </div>
);

const normalizeStatus = (status: string) =>
    status.toUpperCase() === "EXECUTED" ? "COMPLETED" : status.toUpperCase();
const formatFilter = (value: string) =>
    value.charAt(0) + value.slice(1).toLowerCase();
const formatAmount = (value: number) =>
    `Rs ${value.toLocaleString("en-NP", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-NP", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

export default Transactionspage;
