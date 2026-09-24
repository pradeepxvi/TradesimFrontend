import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/DashBoard/Sidebar";
import TopNavbar from "../components/DashBoard/TopNavbar";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">(() =>
        localStorage.getItem("theme") === "light" ? "light" : "dark",
    );

    const handleThemeChange = (nextTheme: "dark" | "light") => {
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
    };

    return (
        <div
            className={`theme-${theme} min-h-screen bg-transparent text-slate-200`}
        >
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <div className="lg:pl-72">
                <TopNavbar
                    onMenuClick={() => setSidebarOpen(true)}
                    theme={theme}
                    onThemeChange={handleThemeChange}
                />

                <main className="min-h-[calc(100vh-76px)] bg-transparent px-0 pb-8 pt-2 sm:pt-3">
                    <div className="page-shell">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
