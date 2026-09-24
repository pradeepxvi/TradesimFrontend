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
          flex w-64 flex-col
          border-r border-slate-800
          bg-[#151a21]
          transition-transform duration-300
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}
                <div className="flex h-[76px] items-center justify-between border-b border-slate-800 px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <TrendingUp size={21} className="text-white" />
                        </div>

                        <div>
                            <h1 className="text-[17px] font-semibold text-white">
                                TradeSim
                            </h1>

                            <p className="text-xs text-slate-500">
                                NEPSE Paper Trading
                            </p>
                        </div>
                    </div>

                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ... parent wrapper ... */}
                <nav className="flex-1 overflow-y-auto px-3 py-5">
                    <div className="space-y-1">
                        {mainNavigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) => `
            group flex items-center gap-3 rounded-lg px-3 py-3
            text-sm font-medium transition
            ${
                isActive
                    ? "border border-blue-500/40 bg-blue-600/20 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }
          `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={19}
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
                                                size={15}
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
                <div className="border-t border-slate-800 px-3 py-4">
                    <NavLink
                        to="/profile"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${isActive ? "bg-blue-600/20 text-blue-400" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
                        }
                    >
                        <UserRound
                            size={19}
                            className="text-slate-500 group-hover:text-slate-300"
                        />
                        <span>Profile</span>
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="group mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut
                            size={19}
                            className="text-slate-500 group-hover:text-red-400"
                        />
                        <span>Logout</span>
                    </button>
                </div>
                <div className="border-t border-slate-800 px-4 py-3">
                    <p className="truncate text-sm font-medium text-slate-200">
                        {user.user?.full_name || "User"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                        {user.user?.email || ""}
                    </p>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
