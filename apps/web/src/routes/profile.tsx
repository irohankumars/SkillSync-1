import { useEffect } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session && !isPending) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* 👤 User Info */}
      <section className="border rounded-lg p-4">
        <h1 className="text-xl font-semibold">{session?.user.name}</h1>
        <p className="text-sm text-muted-foreground">
          Aspiring full-stack developer 🚀
        </p>

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
            <span className="border px-2 py-1 rounded text-xs">React</span>
            <span className="border px-2 py-1 rounded text-xs">Node</span>
            <span className="border px-2 py-1 rounded text-xs">MongoDB</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Want</p>
          <div className="flex gap-2 flex-wrap">
            <span className="border px-2 py-1 rounded text-xs">DSA</span>
            <span className="border px-2 py-1 rounded text-xs">
              System Design
            </span>
          </div>
        </div>
      </section>

      {/* 📊 Skill Level */}
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Skill Level</h2>
        <p className="text-sm text-muted-foreground">Intermediate</p>
      </section>

      {/* 📁 Portfolio */}
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Portfolio</h2>

        <div className="space-y-2 text-sm">
          <p>✔ Completed 12 learning sessions</p>
          <p>✔ Practiced React & Backend</p>
          <p>✔ Current progress: 70%</p>
        </div>
      </section>

      {/* 🏅 Badges / Ratings */}
      <section className="border rounded-lg p-4">
        <h2 className="font-medium mb-2">Badges & Ratings</h2>

        <div className="flex gap-2 flex-wrap text-sm">
          <span className="border px-2 py-1 rounded">
            🔥 Consistent Learner
          </span>
          <span className="border px-2 py-1 rounded">🤝 Good Collaborator</span>
        </div>
      </section>
    </div>
  );
}
