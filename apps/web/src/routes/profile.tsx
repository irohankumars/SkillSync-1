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

  // redirect
  useEffect(() => {
    if (!session && !isPending) navigate("/login");
  }, [session, isPending]);

  // fetch user
  useEffect(() => {
    if (!session?.user?.email) return;

    fetch(`http://localhost:3000/me?email=${session.user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          name: data.name || "",
          bio: data.bio || "",
          skillsHave: data.skillsHave?.join(", ") || "",
          skillsWant: data.skillsWant?.join(", ") || "",
          avatar: data.avatar || "",
        });
      });
  }, [session]);

  // save profile
  const handleSave = async () => {
    await fetch("http://localhost:3000/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: session?.user?.email,
        name: form.name,
        bio: form.bio,
        skillsHave: form.skillsHave.split(",").map((s) => s.trim()),
        skillsWant: form.skillsWant.split(",").map((s) => s.trim()),
        avatar: form.avatar,
      }),
    });

    alert("Profile updated 🚀");
    setEditMode(false);

    const updated = await fetch(
      `http://localhost:3000/me?email=${session?.user?.email}`,
    ).then((r) => r.json());

    setUser(updated);
  };

  if (isPending || !user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      {/* 👤 PROFILE */}
      <div className="border p-6 rounded space-y-4">
        {editMode ? (
          <>
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Image URL
              </label>
              <input
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="Paste image link"
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Your Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Short Description
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell others about you..."
                className="border p-2 w-full rounded"
              />
            </div>

            {/* Skills Have */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Skills You Have
              </label>
              <input
                value={form.skillsHave}
                onChange={(e) =>
                  setForm({ ...form, skillsHave: e.target.value })
                }
                placeholder="e.g. ML, OS, JavaScript"
                className="border p-2 w-full rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                These are skills you can teach others
              </p>
            </div>

            {/* Skills Want */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Skills You Want to Learn
              </label>
              <input
                value={form.skillsWant}
                onChange={(e) =>
                  setForm({ ...form, skillsWant: e.target.value })
                }
                placeholder="e.g. React, Node.js"
                className="border p-2 w-full rounded"
              />
              <p className="text-xs text-gray-500 mt-1">
                These help us find better matches for you
              </p>
            </div>

            <button
              onClick={handleSave}
              className="bg-black text-white px-4 py-2 rounded w-full mt-2"
            >
              Save Profile
            </button>
          </>
        ) : (
          <>
            <img
              src={user.avatar || "https://via.placeholder.com/100"}
              className="w-20 h-20 rounded-full"
            />

            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.bio}</p>

            <button
              onClick={() => setEditMode(true)}
              className="border px-4 py-1 rounded"
            >
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* 🧠 SKILLS */}
      <div className="border p-4 rounded">
        <h3 className="font-semibold mb-2">Skills</h3>
        <p>
          <strong>Can Teach:</strong> {user.skillsHave?.join(", ")}
        </p>
        <p>
          <strong>Wants to Learn:</strong> {user.skillsWant?.join(", ")}
        </p>
      </div>

      {/* 📊 STATS */}
      <div className="border p-4 rounded">
        <p>Sessions: {user.sessionsCompleted || 0}</p>
        <p>Streak: {user.streak || 0}</p>
      </div>
    </div>
  );
}
