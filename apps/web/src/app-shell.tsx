import { MessageCircle } from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

function RoutedLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isAIPage = location.pathname === "/ai";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      storageKey="vite-ui-theme"
    >
      <div className="grid h-svh grid-rows-[auto_1fr]">
        <Header />
        <Outlet />
      </div>

      {/* 🔥 Hide on AI page */}
      {!isAIPage && (
        <button
          onClick={() => navigate("/ai")}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border shadow-lg flex items-center justify-center hover:scale-105 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      <Toaster richColors />
    </ThemeProvider>
  );
}

export default function AppShell() {
  return <RoutedLayout />;
}
