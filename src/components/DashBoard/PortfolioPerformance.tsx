import { BriefcaseBusiness, Wallet } from "lucide-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Portfolio, Wallet as getWallet } from "../../api/market";
import { sumNumericValues, toFiniteNumber } from "../../utils/finance";
import { PortfolioChart } from "../../pages/app/Portfoliopage";
import type { PortfolioHolding } from "../../types/market";

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
    const totalValue = sumNumericValues(
        holdings.map((holding) => holding.market_value),
    );
    const totalProfitLoss = sumNumericValues(
        holdings.map((holding) => holding.unrealized_profit_loss),
    );
    const positive = totalProfitLoss !== null && totalProfitLoss >= 0;

    const holding = useQuery({
        queryFn: Portfolio,
        queryKey: ["holdingss"],
    });
    const holding_data: PortfolioHolding[] | undefined = holding.data;

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
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-300">
                        <p className="font-medium text-amber-300">
                            Unable to load your portfolio
                        </p>
                        <p className="mt-1 text-slate-400">
                            Please try again in a moment.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-3 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <Metric
                            label="Market value"
                            value={formatAmount(totalValue)}
                        />
                        <Metric
                            label="Unrealized P/L"
                            value={formatSignedAmount(totalProfitLoss)}
                            tone={
                                totalProfitLoss === null
                                    ? "neutral"
                                    : positive
                                      ? "positive"
                                      : "negative"
                            }
                        />
                        <Metric
                            label="Holdings"
                            value={String(holdings.length)}
                        />
                        <Metric
                            label="Available balance"
                            value={formatAmount(
                                toFiniteNumber(
                                    walletQuery.data?.virtual_balance,
                                ),
                            )}
                            icon
                        />
                    </div>
                )}
            </div>
            <PortfolioChart holdings={holding_data || []} />
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

const formatAmount = (value: number | null) =>
    value === null
        ? "N/A"
        : `Rs ${value.toLocaleString("en-NP", { maximumFractionDigits: 2 })}`;

const formatSignedAmount = (value: number | null) =>
    value === null
        ? "N/A"
        : `${value >= 0 ? "+" : "-"}${formatAmount(Math.abs(value))}`;

export default PortfolioPerformance;
