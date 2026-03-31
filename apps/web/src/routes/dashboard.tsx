import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  // 🔥 fetch dashboard data
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:3000/dashboard?email=${session.user.email}`)
        .then((res) => res.json())
        .then(setData);

      fetch("http://localhost:3000/dashboard-matches")
        .then((res) => res.json())
        .then(setMatches);
    }
  }, [session]);

  if (isPending || !data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* 👋 Welcome */}
      <section className="border rounded-lg p-4">
        <h1 className="text-xl font-semibold">Welcome {data.name} 👋</h1>
        <p className="text-sm text-muted-foreground">
          Keep your learning streak going
        </p>
        <div className="mt-3 text-lg font-bold">
          🔥 {data.streak} day streak
        </div>
      </section>

      {/* 📊 Activity */}
      <section className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm">Sessions</p>
          <h2 className="text-xl font-bold">{data.sessions}</h2>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm">Matches</p>
          <h2 className="text-xl font-bold">{matches.length}</h2>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-sm">Progress</p>
          <h2 className="text-xl font-bold">{data.progress}%</h2>
        </div>
      </section>

      {/* 🤖 Suggestions (keep static for now) */}
      <section className="border rounded-lg p-4">
        <h2 className="mb-2 font-medium">Suggestions</h2>
        <div className="space-y-2 text-sm">
          <p>• Try learning React today</p>
          <p>• You match well with backend developers</p>
        </div>
      </section>

      {/* 🤝 Matches */}
      <section className="border rounded-lg p-4">
        <h2 className="mb-3 font-medium">Matches for you</h2>

        <div className="space-y-4">
          {matches.map((m) => (
            <div key={m._id} className="border rounded p-3">
              <p className="font-medium">{m.name}</p>
              <p className="text-sm">Has: {m.skillsHave.join(", ")}</p>
              <p className="text-sm">Wants: {m.skillsWant.join(", ")}</p>
              <span className="text-xs border px-2 py-1 rounded">
                {m.matchScore}% match
              </span>
              <button className="mt-2 w-full border rounded py-1">
                Connect
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🕒 Activity */}
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
