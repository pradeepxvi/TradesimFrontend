import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    Clock3,
} from "lucide-react";
import useMarket from "../../context/useMarket";

const MarketOverview = ({
    title = "Basic market information",
}: {
    title?: string;
}) => {
    const { market_overview, isLoading, error } = useMarket();

    if (isLoading) {
        return <Section title={title} loading />;
    }

    if (error || !market_overview) {
        return (
            <Section title={title}>
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-300">
                    <p className="font-medium text-amber-300">
                        Unable to load market data
                    </p>
                    <p className="mt-1 text-slate-400">
                        We couldn't reach the market feed right now.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-3 rounded-xl bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-200 hover:bg-amber-500/20"
                    >
                        Retry market data
                    </button>
                </div>
            </Section>
        );
    }

    const nepse = market_overview.indices?.find(
        (index) => index.symbol.toUpperCase() === "NEPSE",
    );
    const change = Number(nepse?.change ?? 0);
    const changePercent = nepse?.change_percent;
    const positive = change >= 0;
    const summary = market_overview.market_summary;
    const updatedAt = formatUpdatedTime(market_overview.market_status?.time);

    return (
        <Section title={title}>
            <div className="grid gap-3 md:grid-cols-[1.35fr_1fr_1fr]">
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400">
                            NEPSE index
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {market_overview.market_status?.status ?? "N/A"}
                        </span>
                    </div>
                    <p className="mt-2 font-mono text-2xl font-semibold text-white">
                        {nepse?.ltp ?? "-"}
                    </p>
                    <p
                        className={`mt-1 flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-400" : "text-red-400"}`}
                    >
                        {positive ? (
                            <ArrowUpRight size={14} />
                        ) : (
                            <ArrowDownRight size={14} />
                        )}
                        {positive ? "+" : ""}
                        {nepse?.change ?? "-"}
                        {changePercent !== null && changePercent !== undefined
                            ? ` (${changePercent}%)`
                            : ""}
                    </p>
                </div>
                <MarketStat
                    label="Total turnover"
                    value={formatTurnover(summary?.total_turnover)}
                    icon={<Banknote size={16} />}
                    accent="text-amber-300"
                />
                <MarketStat
                    label="Last updated"
                    value={updatedAt}
                    icon={<Clock3 size={16} />}
                    accent="text-cyan-300"
                />
            </div>
        </Section>
    );
};

const MarketStat = ({
    label,
    value,
    icon,
    accent,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    accent: string;
}) => (
    <div className="rounded-2xl border border-slate-800 bg-[#1b222c] p-4">
        <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-400">{label}</p>
            <span className={accent}>{icon}</span>
        </div>
        <p className="mt-4 truncate font-mono text-lg font-semibold text-slate-100">
            {value}
        </p>
    </div>
);

const Section = ({
    title,
    children,
    loading = false,
}: {
    title: string;
    children?: React.ReactNode;
    loading?: boolean;
}) => (
    <section className="overflow-hidden rounded-lg border border-slate-800 bg-[#151a21]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
            <Activity size={16} className="text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        </div>
        <div className="p-4">
            {loading ? (
                <div className="h-24 animate-pulse rounded-lg bg-slate-800/70" />
            ) : (
                children
            )}
        </div>
    </section>
);

const formatTurnover = (value: string | null | undefined) => {
    if (value === null || value === undefined || value === "") return "N/A";

    const amount = Number(value);
    return Number.isFinite(amount)
        ? `Rs ${amount.toLocaleString("en-NP", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
          })}`
        : "N/A";
};

const formatUpdatedTime = (value: string | null | undefined) => {
    if (!value) return "N/A";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? value
        : date.toLocaleTimeString("en-NP", {
              hour: "2-digit",
              minute: "2-digit",
          });
};

export default MarketOverview;
