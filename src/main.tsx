import { createRoot } from "react-dom/client";
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
        element: <Navigate to="/market" />,
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
        element: <DashboardLayout />,
        children: [
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
    <QueryClientProvider client={client}>
        <MarketProvider>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-right"
                autoClose={800}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="dark"
            />
        </MarketProvider>
    </QueryClientProvider>,
);
