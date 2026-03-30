import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* 👋 Welcome */}
      <section className="border rounded-lg p-4">
        <h1 className="text-xl font-semibold">
          Welcome {session?.user.name} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Keep your learning streak going
        </p>
        <div className="mt-3 text-lg font-bold">🔥 5 day streak</div>
      </section>

      {/* 📊 Activity Overview */}
      <section className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm">Sessions</p>
          <h2 className="text-xl font-bold">12</h2>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm">Matches</p>
          <h2 className="text-xl font-bold">6</h2>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm">Progress</p>
          <h2 className="text-xl font-bold">70%</h2>
        </div>
      </section>

      {/* 🤖 AI Suggestions */}
      <section className="border rounded-lg p-4">
        <h2 className="mb-2 font-medium">Suggestions</h2>
        <div className="space-y-2 text-sm">
          <p>• Try learning React today</p>
          <p>• You match well with backend developers</p>
        </div>
      </section>

      {/* 🤝 Match Feed */}
      <section className="border rounded-lg p-4">
        <h2 className="mb-3 font-medium">Matches for you</h2>

        <div className="space-y-4">
          <div className="border rounded p-3">
            <p className="font-medium">Aman</p>
            <p className="text-sm">Has: React</p>
            <p className="text-sm">Wants: DSA</p>
            <span className="text-xs border px-2 py-1 rounded">85% match</span>
            <button className="mt-2 w-full border rounded py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              Connect
            </button>
          </div>

          <div className="border rounded p-3">
            <p className="font-medium">Priya</p>
            <p className="text-sm">Has: DSA</p>
            <p className="text-sm">Wants: Web Dev</p>
            <span className="text-xs border px-2 py-1 rounded">78% match</span>
            <button className="mt-2 w-full border rounded py-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
              Connect
            </button>
          </div>
        </div>
      </section>

      {/* 🕒 Recent Activity */}
      <section className="border rounded-lg p-4">
        <h2 className="mb-2 font-medium">Recent Activity</h2>
        <ul className="text-sm space-y-1">
          <li>✔ Completed session</li>
          <li>✔ New match found</li>
        </ul>
      </section>
    </div>
  );
}
