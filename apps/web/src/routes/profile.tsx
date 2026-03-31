import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  // 🔐 redirect if not logged in
  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  // 🔥 fetch user from DB
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:3000/me?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error(err));
    }
  }, [session]);

  if (isPending || !user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* 👤 User Info */}
      <section className="border rounded-lg p-4">
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <p className="text-sm text-muted-foreground">{user.bio || "No bio"}</p>

        <button className="mt-3 border px-3 py-1 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition">
          Edit Profile
        </button>
      </section>

      {/* 🧠 Skills */}
      <section className="border rounded-lg p-4 space-y-4">
        <h2 className="font-medium">Skills</h2>

        <div>
          <p className="text-sm font-medium mb-1">Have</p>
          <div className="flex gap-2 flex-wrap">
            {user.skillsHave?.map((s: string) => (
              <span key={s} className="border px-2 py-1 rounded text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Want</p>
          <div className="flex gap-2 flex-wrap">
            {user.skillsWant?.map((s: string) => (
              <span key={s} className="border px-2 py-1 rounded text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 Skill Level */}
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Skill Level</h2>
        <p className="text-sm text-muted-foreground">{user.skillLevel}</p>
      </section>

      {/* 📁 Portfolio */}
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Portfolio</h2>

        <div className="space-y-2 text-sm">
          <p>✔ Completed {user.sessionsCompleted} sessions</p>
          <p>🔥 Streak: {user.streak} days</p>
        </div>
      </section>

      {/* 🏅 Badges */}
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Badges</h2>

        <div className="flex gap-2 flex-wrap text-sm">
          {user.badges?.length > 0 ? (
            user.badges.map((b: string) => (
              <span key={b} className="border px-2 py-1 rounded">
                {b}
              </span>
            ))
          ) : (
            <p>No badges yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
