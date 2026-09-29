import { Search } from "lucide-react";

type StockFiltersProps = {
    searchTerm: string;
    selectedSector: string;
    sectors: string[];
    onSearchChange: (value: string) => void;
    onSectorChange: (value: string) => void;
    onSearchSubmit?: () => void;
};

const StockFilters = ({
    searchTerm,
    selectedSector,
    sectors,
    onSearchChange,
    onSectorChange,
    onSearchSubmit,
}: StockFiltersProps) => (
    <div className="surface-card stock-filter-bar rounded-xl p-3">
        <div className="relative min-w-0">
            <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
                aria-label="Search stocks"
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") onSearchSubmit?.();
                }}
                placeholder="Search symbol or company"
                className="stock-filter-control pl-9"
            />
        </div>

        <select
            aria-label="Filter by sector"
            value={selectedSector}
            onChange={(event) => onSectorChange(event.target.value)}
            className="stock-filter-control stock-filter-select"
        >
            {sectors.map((sector) => (
                <option key={sector} value={sector}>
                    {sector === "All" ? "All sectors" : sector}
                </option>
            ))}
        </select>
    </div>
);

export default StockFilters;
