import { Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { getStoredUser } from "../../utils/session";
import useMarket from "../../context/useMarket";

interface TopNavbarProps {
    onMenuClick: () => void;
    theme: "dark" | "light";
    onThemeChange: (theme: "dark" | "light") => void;
}

const TopNavbar = ({ onMenuClick, theme, onThemeChange }: TopNavbarProps) => {
    const [themeOpen, setThemeOpen] = useState(false);
    const { market_overview } = useMarket();

    const change =
        Number(
            market_overview?.indices.find((item) => item.symbol == "NEPSE")
                ?.change,
        ) || 0;

    const user = getStoredUser();
    if (!user) {
        return;
    }
    const themes = [
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "light" as const, label: "Light", icon: Sun },
    ];
    const currentTheme =
        themes.find((item) => item.value === theme) ?? themes[1];
    const ThemeIcon = currentTheme.icon;
    return (
        <header className="sticky top-0 z-30 h-[76px] border-b border-slate-800 bg-[#151a21]/95 backdrop-blur">
            <div className="flex h-full items-center gap-3 px-4 sm:px-5 lg:px-6">
                {/* Mobile menu */}
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                >
                    <Menu size={22} />
                </button>

                {/* Search */}
                <div className="relative max-w-md flex-1">
                    <Search
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        type="text"
                        placeholder="Search stocks..."
                        className="
              h-10 w-full rounded-lg
              border border-slate-800
              bg-[#1b222c]
              pl-10 pr-4
              text-sm text-slate-200
              outline-none
              placeholder:text-slate-500
              focus:border-blue-500/50
              focus:ring-2 focus:ring-blue-500/10
            "
                    />
                </div>

                {/* Market information */}
                <div className="hidden items-center gap-3 xl:flex">
                    {/* Market status */}
                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        <span className="text-xs font-medium text-emerald-400">
                            Market
                            {market_overview?.market_status?.status === "OPEN"
                                ? " Open"
                                : " Closed"}
                        </span>
                    </div>

                    {/* NEPSE */}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500">NEPSE</span>

                        <span className="font-semibold text-slate-200">
                            {
                                market_overview?.indices.find(
                                    (item) => item.symbol == "NEPSE",
                                )?.ltp
                            }
                        </span>

                        {change > 0 ? (
                            <span className="text-green-400">+{change}</span>
                        ) : (
                            <span className="text-red-400">{change}</span>
                        )}
                    </div>
                </div>

                {/* Right side */}
                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <div className="relative">
                        <button
                            aria-label="Change theme"
                            onClick={() => setThemeOpen((open) => !open)}
                            className="flex h-9 items-center gap-2 rounded-md border border-slate-800 px-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                        >
                            <ThemeIcon size={16} />
                            <span className="hidden text-xs sm:inline">
                                {currentTheme.label}
                            </span>
                        </button>
                        {themeOpen && (
                            <div className="absolute right-0 top-11 z-50 w-32 rounded-md border border-slate-700 bg-[#151a21] p-1 shadow-xl">
                                {themes.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.value}
                                            onClick={() => {
                                                onThemeChange(item.value);
                                                setThemeOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-2 rounded px-2 py-2 text-xs ${theme === item.value ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                                        >
                                            <Icon size={14} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* Mobile market status */}
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-2 xl:hidden">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />

                        <span className="hidden text-xs font-medium text-emerald-400 sm:block">
                            Open
                        </span>
                    </div>

                    {/* User */}
                    <button className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {user.user?.id}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
