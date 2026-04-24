import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Sun, Moon } from "lucide-react"; // ✅ added

export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();

  const [data, setData] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ THEME STATE ADDED
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/me?email=${session.user.email}`,
        );

        const userData = await res.json();
        setData(userData);
        setMatches([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 🔥 HERO (NOT LOGGED IN) */}
      {!session && (
        <div className="relative w-full h-[90vh] flex items-center justify-center text-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

          <div className="absolute inset-0 bg-black/80" />

          <div className="relative z-10 space-y-6 px-4">
            <p className="text-xs tracking-widest text-muted-foreground">
              CONNECT • LEARN • GROW
            </p>

            <h1 className="text-6xl sm:text-8xl lg:text-[120px] font-bold text-white">
              EduMax
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Find the perfect learning partner. Teach what you know, learn what
              you need.
            </p>

            <a
              href="/login"
              className="inline-block mt-4 bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200"
            >
              Get Started →
            </a>
          </div>
        </div>
      )}

      {/* ✅ DASHBOARD (LOGGED IN) */}
      {session && data && (
        <div className="px-6 lg:px-12 py-6 space-y-6">
          {/* 🔵 HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {data.name} 👋
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
                🔥 {data.streak || 0} day streak
              </div>

              {/* ✅ THEME TOGGLE BUTTON */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl border bg-background hover:bg-muted transition"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          {/* 🔥 CORE STATS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="card">
              <p className="label">Sessions</p>
              <h2 className="value text-blue-600">
                {data.sessionsCompleted || 0}
              </h2>
            </div>

            <div className="card">
              <p className="label">Matches</p>
              <h2 className="value text-blue-600">{matches.length || 0}</h2>
            </div>

            <div className="card">
              <p className="label">Connections</p>
              <h2 className="value text-blue-600">{data.connections || 0}</h2>
            </div>

            <div className="card">
              <p className="label">Streak</p>
              <h2 className="value text-blue-600">{data.streak || 0}d</h2>
            </div>

            <div className="card">
              <p className="label">Progress</p>
              <h2 className="value text-blue-600">{data.progress || 70}%</h2>
            </div>

            <div className="card">
              <p className="label">This Week</p>
              <h2 className="value text-blue-600">
                {data.weeklySessions || 0}
              </h2>
            </div>
          </div>

          {/* 📈 PROGRESS + WEEKLY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl border p-6 bg-background shadow-sm">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <h2 className="text-3xl font-bold mt-2 text-blue-600">
                {data.progress || 70}%
              </h2>

              <div className="w-full bg-muted rounded-full h-2 mt-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${data.progress || 70}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border p-6 bg-background shadow-sm">
              <p className="text-sm text-muted-foreground">Weekly Activity</p>

              <div className="flex items-end gap-2 mt-6 h-24">
                {[2, 4, 3, 5, 6, 4, 3].map((val, i) => (
                  <div
                    key={i}
                    className="bg-blue-600/80 rounded-md w-6"
                    style={{ height: `${val * 12}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 🤝 MATCHES */}
          <div className="rounded-2xl border p-6 bg-background shadow-sm space-y-4">
            <h2 className="text-lg font-semibold">Matches for you</h2>

            {matches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <p className="text-muted-foreground text-sm">
                  No matches yet — start connecting 🚀
                </p>

                <a
                  href="/matches"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition"
                >
                  Find your matches
                </a>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/40 transition"
                  >
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Has: {m.hasSkills?.join(", ")} • Wants:{" "}
                        {m.wantsSkills?.join(", ")}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-blue-600">
                      {m.matchPercentage || 80}% match
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
