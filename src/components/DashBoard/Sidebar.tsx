import {
    BarChart3,
    Bookmark,
    BriefcaseBusiness,
    ChevronRight,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    UserRound,
    TrendingUp,
    X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { getStoredUser } from "../../utils/session";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const mainNavigation = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "Market",
        icon: TrendingUp,
        path: "/market",
    },
    {
        name: "Stocks",
        icon: BarChart3,
        path: "/stocks",
    },
    {
        name: "Watchlist",
        icon: Bookmark,
        path: "/watchlist",
    },
    {
        name: "Portfolio",
        icon: BriefcaseBusiness,
        path: "/portfolio",
    },
    {
        name: "Orders",
        icon: ClipboardList,
        path: "/orders",
    },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const navigate = useNavigate();

    const user = getStoredUser();
    if (!user) {
        return;
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-white/8 bg-[#121a22]/80
          shadow-[0_30px_60px_rgba(15,23,42,0.45)]
          backdrop-blur-2xl
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                <div className="flex h-[76px] items-center justify-between border-b border-white/8 px-4">
                    <div className="flex items-center gap-3">
                        <img
                            src="/tradesim-mark.svg"
                            alt="TradeSim"
                            className="h-11 w-11 object-contain"
                        />

                        <div>
                            <h1 className="text-[17px] font-semibold text-white">
                                TradeSim
                            </h1>
                            <p className="text-[11px] text-slate-400">
                                NEPSE Paper Trading
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <div className="space-y-1.5">
                        {mainNavigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) => `
            group flex items-center gap-3 rounded-2xl px-3 py-3
            text-sm font-medium transition-all duration-200
            ${
                isActive
                    ? "border border-blue-400/30 bg-blue-500/10 text-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
            }
          `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={18}
                                                strokeWidth={1.8}
                                                className={
                                                    isActive
                                                        ? "text-blue-400"
                                                        : "text-slate-500 group-hover:text-slate-300"
                                                }
                                            />

                                            <span className="flex-1">
                                                {item.name}
                                            </span>

                                            <ChevronRight
                                                size={14}
                                                className={`
                  transition
                  ${
                      isActive
                          ? "text-blue-400"
                          : "text-slate-700 group-hover:text-slate-400"
                  }
                `}
                                            />
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                <div className="border-t border-white/8 px-3 py-4">
                    <NavLink
                        to="/profile"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${isActive ? "bg-blue-600/15 text-blue-400" : "text-slate-400 hover:bg-slate-800/80 hover:text-white"}`
                        }
                    >
                        <UserRound
                            size={18}
                            className="text-slate-500 group-hover:text-slate-300"
                        />
                        <span>Profile</span>
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut
                            size={18}
                            className="text-slate-500 group-hover:text-red-400"
                        />
                        <span>Logout</span>
                    </button>
                </div>

                <div className="border-t border-white/8 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-200">
                        {user.user?.full_name || "User"}
                    </p>
                    <p className="truncate pt-1 text-[11px] text-slate-500">
                        {user.user?.email || ""}
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
