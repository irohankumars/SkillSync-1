import { createBrowserRouter } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute";

import AppShell from "./app-shell";
import AI from "./routes/ai";
import Dashboard from "./routes/dashboard";
import Login from "./routes/login";
import SuccessPage from "./routes/success";
import Profile from "./routes/profile";
import Matches from "./routes/matches";
import Onboarding from "@/routes/onboarding";
import Chat from "@/routes/chat";

function NotFound() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="text-muted-foreground">
        The requested page could not be found.
      </p>
    </main>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      // 🔥 DEFAULT PAGE → Dashboard
      { index: true, element: <Dashboard /> },

      { path: "login", element: <Login /> },
      { path: "success", element: <SuccessPage /> },

      // 🔒 PROTECTED
      {
        path: "onboarding",
        element: (
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: <Dashboard />, // same page (optional route)
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "matches",
        element: (
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        ),
      },
      {
        path: "ai",
        element: (
          <ProtectedRoute>
            <AI />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat/:id",
        element: (
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        ),
      },

      // ❌ NOT FOUND
      { path: "*", element: <NotFound /> },
    ],
  },
]);
