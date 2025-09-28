import "@rainbow-me/rainbowkit/styles.css";

import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import InvoiceFactor from "./components/InvoiceFactor";
import BusinessRoute from "./components/BusinessRoute";
import InvestorRoute from "./components/InvestorRoute";
import CustomerRoute from "./components/CustomerRoute";
import DashboardRoute from "./components/DashboardRoute";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient();

export default function App() {
  return (
    <HelmetProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={{
              lightMode: lightTheme(),
              darkMode: darkTheme(),
            }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<InvoiceFactor />} />
                <Route path="/factor-your-invoice" element={<BusinessRoute />} />
                <Route path="/investor" element={<InvestorRoute />} />
                <Route path="/customer" element={<CustomerRoute />} />
                <Route path="/dashboard" element={<DashboardRoute />} />
              </Routes>
            </BrowserRouter>
            <Toaster
              toastOptions={{
                success: {
                  icon: "🌈",
                },
                error: {
                  icon: "🔥",
                },
                position: "bottom-right",
                duration: 5000,
                style: {
                  background: "#666",
                  color: "#ccc",
                },
              }}
            />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </HelmetProvider>
  );
}
