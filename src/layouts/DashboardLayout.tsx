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
        <div className={`theme-${theme} min-h-screen text-slate-200`}>
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main area */}
            <div className="lg:pl-64">
                {/* Top Navbar */}
                <TopNavbar
                    onMenuClick={() => setSidebarOpen(true)}
                    theme={theme}
                    onThemeChange={handleThemeChange}
                />

                {/* Page */}
                <main className="min-h-[calc(100vh-76px)]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
