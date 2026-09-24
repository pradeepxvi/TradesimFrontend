import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
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
                <Message text="Market information is unavailable right now." />
            </Section>
        );
    }

    const nepse = market_overview.indices.find(
        (index) => index.symbol.toUpperCase() === "NEPSE",
    );
    const change = Number(nepse?.change ?? 0);
    const changePercent = nepse?.change_percent;
    const positive = change >= 0;
    const summary = market_overview.market_summary;

    return (
        <Section title={title}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400">
                            NEPSE index
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {market_overview.market_status.status}
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
                <Metric
                    label="Advances"
                    value={summary.advances}
                    tone="positive"
                />
                <Metric
                    label="Declines"
                    value={summary.declines}
                    tone="negative"
                />
                <Metric label="Unchanged" value={summary.unchanged} />
            </div>
        </Section>
    );
};

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

const Metric = ({
    label,
    value,
    tone = "neutral",
}: {
    label: string;
    value: number | null;
    tone?: "positive" | "negative" | "neutral";
}) => (
    <div className="rounded-lg border border-slate-800 bg-[#1b222c] p-4">
        <p
            className={`text-xs font-medium ${tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-red-400" : "text-slate-400"}`}
        >
            {label}
        </p>
        <p className="mt-2 font-mono text-xl font-semibold text-slate-100">
            {value ?? "-"}
        </p>
    </div>
);

const Message = ({ text }: { text: string }) => (
    <p className="text-sm text-slate-500">{text}</p>
);

export default MarketOverview;
