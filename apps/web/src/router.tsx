import { createBrowserRouter } from "react-router";

import AppShell from "./app-shell";
import AI from "./routes/ai";
import Dashboard from "./routes/dashboard";
import Home from "./routes/home";
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
    path: "/", // parent
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },

      { path: "login", element: <Login /> },
      { path: "onboarding", element: <Onboarding /> },
      { path: "dashboard", element: <Dashboard /> },

      { path: "chat/:id", element: <Chat /> },
      { path: "ai", element: <AI /> },
      { path: "success", element: <SuccessPage /> },

      { path: "profile", element: <Profile /> },
      { path: "matches", element: <Matches /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
