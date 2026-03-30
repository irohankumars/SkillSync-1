import { useState, useEffect } from "react";

type MatchUser = {
  _id: string;
  name: string;
  skillsHave: string[];
  skillsWant: string[];
  matchScore: number;
};

type RequestType = {
  id: number;
  receiverId: string;
  status: string;
};

export default function Matches() {
  const [tab, setTab] = useState("suggested");
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);

  // 🔥 fetch matches
  useEffect(() => {
    fetch("http://localhost:3000/matches")
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 fetch requests
  useEffect(() => {
    fetch("http://localhost:3000/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔥 connect
  const handleConnect = async (userId: string) => {
    await fetch("http://localhost:3000/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    alert("Request sent 🚀");
  };

  // 🔥 accept
  const handleAccept = async (id: number) => {
    await fetch("http://localhost:3000/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );
  };

  // 🔥 reject
  const handleReject = async (id: number) => {
    await fetch("http://localhost:3000/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)),
    );
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      {/* 🔝 Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setTab("suggested")}
          className={
            tab === "suggested" ? "font-medium" : "text-muted-foreground"
          }
        >
          Suggested
        </button>
        <button
          onClick={() => setTab("connected")}
          className={
            tab === "connected" ? "font-medium" : "text-muted-foreground"
          }
        >
          Connected
        </button>
        <button
          onClick={() => setTab("requests")}
          className={
            tab === "requests" ? "font-medium" : "text-muted-foreground"
          }
        >
          Requests
        </button>
      </div>

      {/* 👥 Suggested */}
      {tab === "suggested" && (
        <div className="space-y-4">
          {matches.map((user) => (
            <div key={user._id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm">Has: {user.skillsHave.join(", ")}</p>
              <p className="text-sm">Wants: {user.skillsWant.join(", ")}</p>

              <div className="flex justify-between mt-2">
                <span className="text-xs border px-2 py-1 rounded">
                  {user.matchScore}% match
                </span>

                <button
                  onClick={() => handleConnect(user._id)}
                  className="border px-3 py-1 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🤝 Connected */}
      {tab === "connected" && (
        <div className="space-y-4">
          {requests
            .filter((r) => r.status === "accepted")
            .map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <p className="font-semibold">Connected User: {r.receiverId}</p>
              </div>
            ))}
        </div>
      )}

      {/* 📥 Requests */}
      {tab === "requests" && (
        <div className="space-y-4">
          {requests
            .filter((r) => r.status === "pending")
            .map((r) => (
              <div key={r.id} className="border rounded-lg p-4">
                <p className="font-semibold">User: {r.receiverId}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAccept(r.id)}
                    className="border px-3 py-1 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    className="border px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
