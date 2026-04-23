import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    skillsHave: "",
    skillsWant: "",
    avatar: "",
  });

  useEffect(() => {
    if (!session && !isPending) navigate("/login");
  }, [session, isPending]);

  useEffect(() => {
    if (!session?.user?.email) return;

    fetch(`http://localhost:3000/me?email=${session.user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || session.user.name || "",
          bio: data.bio || "",
          skillsHave: data.skillsHave?.join(", ") || "",
          skillsWant: data.skillsWant?.join(", ") || "",
          avatar: data.avatar || "",
        });
      });
  }, [session]);

  const handleSave = async () => {
    await fetch("http://localhost:3000/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session?.user?.email,
        name: form.name,
        bio: form.bio,
        skillsHave: form.skillsHave.split(",").map((s) => s.trim()),
        skillsWant: form.skillsWant.split(",").map((s) => s.trim()),
        avatar: form.avatar,
      }),
    });

    setEditMode(false);

    const updated = await fetch(
      `http://localhost:3000/me?email=${session?.user?.email}`,
    ).then((r) => r.json());

    setUser(updated);
  };

  if (isPending || !user) return <div>Loading...</div>;

  const displayName = user.name || session?.user?.name || "User";

  const completion =
    [
      user.name,
      user.bio,
      user.skillsHave?.length,
      user.skillsWant?.length,
      user.avatar,
    ].filter(Boolean).length * 20;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="bg-background border rounded-xl p-6 shadow-sm text-center">
            <img
              src={
                user.avatar || `https://ui-avatars.com/api/?name=${displayName}`
              }
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />

            <h2 className="text-lg font-semibold">{displayName}</h2>

            <p className="text-sm text-muted-foreground">
              {user.bio || "No bio added"}
            </p>

            <p className="text-xs text-green-500 mt-2">
              ● Available for sessions
            </p>

            <button
              onClick={() => setEditMode(true)}
              className="mt-4 w-full border rounded-lg py-2 text-sm hover:bg-muted"
            >
              Edit Profile
            </button>
          </div>

          {/* Completion */}
          <div className="bg-background border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between text-sm mb-2">
              <span>Profile Completion</span>
              <span>{completion}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-background border rounded-xl p-4 shadow-sm space-y-2">
            <p className="text-sm">
              Sessions:{" "}
              <span className="font-semibold">
                {user.sessionsCompleted || 0}
              </span>
            </p>
            <p className="text-sm">
              Streak: <span className="font-semibold">{user.streak || 0}</span>
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          {editMode && (
            <div className="bg-background border rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="font-semibold">Edit Profile</h2>

              <input
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="Avatar URL"
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />

              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />

              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />

              <input
                value={form.skillsHave}
                onChange={(e) =>
                  setForm({ ...form, skillsHave: e.target.value })
                }
                placeholder="Skills you can teach"
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />

              <input
                value={form.skillsWant}
                onChange={(e) =>
                  setForm({ ...form, skillsWant: e.target.value })
                }
                placeholder="Skills you want to learn"
                className="w-full border rounded-lg p-2 text-sm bg-background"
              />

              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm w-full"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* Skills */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-3">Skills</h3>

            <div className="flex flex-wrap gap-2 mb-3">
              {user.skillsHave?.map((s: string, i: number) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                >
                  {s} • Intermediate
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {user.skillsWant?.map((s: string, i: number) => (
                <span
                  key={i}
                  className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold mb-2">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">No sessions yet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
