import { Menu, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUser } from "../../utils/session";
import useMarket from "../../context/useMarket";
import { Companies } from "../../api/market";
import { getProfile, type ProfileResponse } from "../../api/profile";

interface TopNavbarProps {
    onMenuClick: () => void;
    theme: "dark" | "light";
    onThemeChange: (theme: "dark" | "light") => void;
}

const TopNavbar = ({ onMenuClick, theme, onThemeChange }: TopNavbarProps) => {
    const [themeOpen, setThemeOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const { market_overview } = useMarket();
    const navigate = useNavigate();
    const companiesQuery = useQuery({
        queryKey: ["companies"],
        queryFn: Companies,
        staleTime: 30_000,
        enabled: searchOpen,
    });

    const change =
        Number(
            market_overview?.indices.find((item) => item.symbol == "NEPSE")
                ?.change,
        ) || 0;

    const user = getStoredUser();
    const themes = [
        { value: "dark" as const, label: "Dark", icon: Moon },
        { value: "light" as const, label: "Light", icon: Sun },
    ];
    const currentTheme =
        themes.find((item) => item.value === theme) ?? themes[1];
    const ThemeIcon = currentTheme.icon;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchResults = (companiesQuery.data ?? [])
        .filter(
            (company) =>
                company.symbol.toLowerCase().includes(normalizedSearch) ||
                company.name.toLowerCase().includes(normalizedSearch),
        )
        .slice(0, 6);

    const openStock = (symbol: string) => {
        navigate(`/stocks/${encodeURIComponent(symbol)}`);
        setSearchTerm("");
        setSearchOpen(false);
    };

    const myProfile = useQuery<ProfileResponse>({
        queryKey: ["profile"],
        queryFn: getProfile,
    });

    const profile_picture = myProfile.data?.profile_picture;

    return (
        <header className="sticky top-0 z-30 h-[76px] border-b border-white/8 bg-[#121a22]/70 backdrop-blur-2xl">
            <div className="flex h-full items-center gap-3 px-3 sm:px-5 lg:px-6">
                <button
                    onClick={onMenuClick}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 shadow-[0_8px_22px_rgba(15,23,42,0.18)] hover:bg-white/10 lg:hidden"
                >
                    <Menu size={20} />
                </button>

                <div className="relative max-w-md flex-1">
                    <Search
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search stocks..."
                        className="h-10 w-full rounded-2xl border border-white/8 bg-white/5 pl-9 pr-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/15"
                        value={searchTerm}
                        onFocus={() => setSearchOpen(true)}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setSearchOpen(true);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && searchResults[0]) {
                                openStock(searchResults[0].symbol);
                            }
                            if (event.key === "Escape") {
                                setSearchOpen(false);
                            }
                        }}
                    />

                    {searchOpen && normalizedSearch && (
                        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#151a21]/95 p-1 shadow-[0_18px_42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
                            {companiesQuery.isLoading ? (
                                <p className="px-3 py-3 text-xs text-slate-500">
                                    Searching stocks...
                                </p>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((company) => (
                                    <button
                                        key={company.symbol}
                                        type="button"
                                        onMouseDown={(event) =>
                                            event.preventDefault()
                                        }
                                        onClick={() =>
                                            openStock(company.symbol)
                                        }
                                        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/10"
                                    >
                                        <span className="min-w-0">
                                            <span className="block font-mono text-xs font-semibold text-blue-300">
                                                {company.symbol}
                                            </span>
                                            <span className="block truncate text-xs text-slate-400">
                                                {company.name}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-[11px] text-slate-500">
                                            View
                                        </span>
                                    </button>
                                ))
                            ) : (
                                <p className="px-3 py-3 text-xs text-slate-500">
                                    No matching stocks found.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="hidden items-center gap-3 xl:flex">
                    <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px] font-medium text-emerald-300">
                            Market
                            {market_overview?.market_status?.status === "OPEN"
                                ? " Open"
                                : " Closed"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-sm shadow-[0_8px_20px_rgba(15,23,42,0.12)]">
                        <span className="text-slate-400">NEPSE</span>
                        <span className="font-semibold text-slate-100">
                            {
                                market_overview?.indices.find(
                                    (item) => item.symbol == "NEPSE",
                                )?.ltp
                            }
                        </span>
                        {change > 0 ? (
                            <span className="text-emerald-400">+{change}</span>
                        ) : (
                            <span className="text-red-400">{change}</span>
                        )}
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <button
                            aria-label="Change theme"
                            onClick={() => setThemeOpen((open) => !open)}
                            className="flex h-9 items-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-2.5 text-slate-300 shadow-[0_8px_20px_rgba(15,23,42,0.12)] hover:border-blue-400/50 hover:text-white"
                        >
                            <ThemeIcon size={16} />
                            <span className="hidden text-[11px] font-medium sm:inline">
                                {currentTheme.label}
                            </span>
                        </button>
                        {themeOpen && (
                            <div className="absolute right-0 top-11 z-50 w-32 rounded-2xl border border-white/8 bg-[#151a21]/90 p-1 shadow-[0_18px_42px_rgba(15,23,42,0.34)] backdrop-blur-xl">
                                {themes.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.value}
                                            onClick={() => {
                                                onThemeChange(item.value);
                                                setThemeOpen(false);
                                            }}
                                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs ${theme === item.value ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                                        >
                                            <Icon size={14} />
                                            {item.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-2 xl:hidden">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="hidden text-[10px] font-medium text-emerald-400 sm:block">
                            Open
                        </span>
                    </div>

                    {user ? (
                        <Link
                            to="/profile"
                            className="ml-1 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-400 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(59,130,246,0.35)]"
                        >
                            {profile_picture ? (
                                <img
                                    src={profile_picture}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                user.user?.full_name?.charAt(0).toUpperCase() ||
                                "U"
                            )}
                        </Link>
                    ) : (
                        <button
                            onClick={() => navigate("/login")}
                            className="ml-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;
