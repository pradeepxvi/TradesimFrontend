import { createRoot } from "react-dom/client";
import { Component, type ErrorInfo, type ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import {
    Navigate,
    RouterProvider,
    createBrowserRouter,
} from "react-router-dom";

// React Router Dom

// context
import MarketProvider from "./context/MarketContext.tsx";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage.tsx";
import PasswordReset from "./pages/Auth/PasswordReset.tsx";
import PasswordResetRequestPage from "./pages/Auth/PasswordResetRequestPage.tsx";
import RegisterPage from "./pages/Auth/RegisterPage.tsx";
import VerifyOTPPage from "./pages/Auth/VerifyOTPPage.tsx";
import VerifyResetOtpPage from "./pages/Auth/VerifyResetOtpPage.tsx";

// App pages
import Dashboard from "./pages/app/Dashboard.tsx";

// Layouts
import AuthLayout from "./layouts/AuthLayout.tsx";
import ProtectedRoutes from "./layouts/ProtectedRoutes.tsx";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import ResendOTPPage from "./pages/Auth/ResendOTPPage.tsx";
import Marketpage from "./pages/app/Marketpage.tsx";
import Stockspage from "./pages/app/Stockspage.tsx";
import Watchlistpage from "./pages/app/Watchlistpage.tsx";
import Portfoliopage from "./pages/app/Portfoliopage.tsx";
import Orderspage from "./pages/app/Orderspage.tsx";
import Profilepage from "./pages/app/Profilepage.tsx";

class ErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Unhandled app error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-[#0b1020] px-6 text-center text-slate-100">
                    <div className="max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
                        <img
                            src="/tradesim-mark.svg"
                            alt="TradeSim"
                            className="mx-auto h-20 w-20 object-contain"
                        />
                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
                            Something went wrong
                        </p>
                        <h1 className="mt-4 text-2xl font-bold text-white">
                            TradeSim hit an unexpected issue
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Please refresh the page and try again.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
                        >
                            Reload page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const client = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" />,
    },
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/password-reset",
                element: <PasswordReset />,
            },
            {
                path: "/forgot-password",
                element: <PasswordResetRequestPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/verify-otp",
                element: <VerifyOTPPage />,
            },
            {
                path: "/resend-otp",
                element: <ResendOTPPage />,
            },
            {
                path: "/password-reset/verify-otp",
                element: <VerifyResetOtpPage />,
            },
        ],
    },
    {
        element: <ProtectedRoutes />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "/market",
                        element: <Marketpage />,
                    },
                    {
                        path: "/stocks",
                        element: <Stockspage />,
                    },
                    {
                        path: "/stocks/:symbol",
                        element: <Stockspage />,
                    },
                    {
                        path: "/watchlist",
                        element: <Watchlistpage />,
                    },
                    {
                        path: "/portfolio",
                        element: <Portfoliopage />,
                    },
                    {
                        path: "/orders",
                        element: <Orderspage />,
                    },
                    {
                        path: "/profile",
                        element: <Profilepage />,
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <QueryClientProvider client={client}>
            <MarketProvider>
                <RouterProvider router={router} />
                <ToastContainer
                    position="top-right"
                    autoClose={1800}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="dark"
                />
            </MarketProvider>
        </QueryClientProvider>
    </ErrorBoundary>,
);
