import { BriefcaseBusiness, Wallet } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Portfolio, Wallet as getWallet } from "../../api/market";

const PortfolioPerformance = () => {
    const [portfolioQuery, walletQuery] = useQueries({
        queries: [
            { queryKey: ["portfolio"], queryFn: Portfolio, staleTime: 30_000 },
            { queryKey: ["wallet"], queryFn: getWallet, staleTime: 30_000 },
        ],
    });

    const loading = portfolioQuery.isLoading || walletQuery.isLoading;
    const error = portfolioQuery.isError || walletQuery.isError;
    const holdings = portfolioQuery.data ?? [];
    const totalValue = holdings.reduce(
        (total, holding) => total + Number(holding.market_value || 0),
        0,
    );
    const totalProfitLoss = holdings.reduce(
        (total, holding) => total + Number(holding.unrealized_profit_loss || 0),
        0,
    );
    const positive = totalProfitLoss >= 0;

    return (
        <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
            <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                <BriefcaseBusiness size={16} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                    Portfolio performance
                </h2>
            </div>
            <div className="p-4">
                {loading ? (
                    <div className="h-32 animate-pulse rounded-lg bg-slate-800/70" />
                ) : error ? (
                    <p className="text-sm text-slate-500">
                        Portfolio information is unavailable right now.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Metric
                            label="Market value"
                            value={formatAmount(totalValue)}
                        />
                        <Metric
                            label="Unrealized P/L"
                            value={`${positive ? "+" : ""}${formatAmount(totalProfitLoss)}`}
                            tone={positive ? "positive" : "negative"}
                        />
                        <Metric
                            label="Holdings"
                            value={String(holdings.length)}
                        />
                        <Metric
                            label="Available balance"
                            value={formatAmount(
                                Number(walletQuery.data?.virtual_balance ?? 0),
                            )}
                            icon
                        />
                    </div>
                )}
            </div>
        </section>
    );
};

const Metric = ({
    label,
    value,
    tone = "neutral",
    icon = false,
}: {
    label: string;
    value: string;
    tone?: "positive" | "negative" | "neutral";
    icon?: boolean;
}) => (
    <div className="min-w-0 rounded-lg border border-slate-800 bg-[#1b222c] p-3">
        <p className="flex items-center gap-1 truncate text-xs text-slate-500">
            {icon && <Wallet size={12} />}
            {label}
        </p>
        <p
            className={`mt-2 truncate font-mono text-sm font-semibold ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-red-400" : "text-slate-100"}`}
        >
            {value}
        </p>
    </div>
);

const formatAmount = (value: number) =>
    `Rs ${value.toLocaleString("en-NP", { maximumFractionDigits: 2 })}`;

export default PortfolioPerformance;
