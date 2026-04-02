import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";

type MatchUser = {
  _id: string;
  name: string;
  email: string;
  skillsHave: string[];
  skillsWant: string[];
  matchScore: number;
};

type RequestType = {
  _id: string;
  senderId: any;
  receiverId: any;
  status: string;
};

export default function Matches() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const [tab, setTab] = useState("suggested");
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);

  // ✅ FETCH MATCHES
  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:3000/matches?email=${session.user.email}`)
        .then(async (res) => {
          if (!res.ok) throw new Error(await res.text());
          return res.json();
        })
        .then(setMatches)
        .catch(console.error);
    }
  }, [session]);

  // ✅ FETCH REQUESTS
  const loadRequests = () => {
    fetch("http://localhost:3000/requests")
      .then((res) => res.json())
      .then(setRequests)
      .catch(console.error);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // 🔥 FIXED CONNECT (uses emails → backend converts to IDs)
  const handleConnect = async (receiverEmail: string) => {
    await fetch("http://localhost:3000/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderEmail: session?.user?.email,
        receiverEmail,
      }),
    });

    alert("Request sent 🚀");
    loadRequests();
  };

  // ✅ ACCEPT
  const handleAccept = async (id: string) => {
    await fetch("http://localhost:3000/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadRequests();
  };

  // ✅ REJECT
  const handleReject = async (id: string) => {
    await fetch("http://localhost:3000/reject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadRequests();
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6 space-y-6">
      <div className="flex gap-4 border-b pb-2">
        <button onClick={() => setTab("suggested")}>Suggested</button>
        <button onClick={() => setTab("connected")}>Connected</button>
        <button onClick={() => setTab("requests")}>Requests</button>
      </div>

      {/* 👥 Suggested */}
      {tab === "suggested" && (
        <div className="space-y-4">
          {matches.map((user) => (
            <div key={user._id} className="border p-4 rounded">
              <h3>{user.name}</h3>
              <p>Has: {user.skillsHave?.join(", ")}</p>
              <p>Wants: {user.skillsWant?.join(", ")}</p>
              <p>{user.matchScore}% match</p>

              <button
                onClick={() => handleConnect(user.email)}
                className="mt-2 border px-3 py-1 rounded"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🤝 Connected */}
      {tab === "connected" && (
        <div className="space-y-4">
          {requests
            .filter(
              (r) =>
                r.status === "accepted" &&
                (r.senderId?.email === session?.user?.email ||
                  r.receiverId?.email === session?.user?.email),
            )
            .map((r) => {
              const currentUser = session?.user?.email;

              const otherUser =
                r.senderId?.email === currentUser ? r.receiverId : r.senderId;

              return (
                <div
                  key={r._id}
                  className="border p-4 rounded flex items-center justify-between"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        otherUser?.avatar || "https://via.placeholder.com/40"
                      }
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      <p className="font-semibold">
                        {otherUser?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {otherUser?.skillsHave?.join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  <button
                    onClick={() => navigate(`/chat/${otherUser?.email}`)}
                    className="border px-3 py-1 rounded hover:bg-black hover:text-white"
                  >
                    Chat 💬
                  </button>
                </div>
              );
            })}
        </div>
      )}

      {/* 📥 Requests */}
      {tab === "requests" && (
        <div className="space-y-4">
          {requests
            .filter(
              (r) =>
                r.status === "pending" &&
                r.receiverId?.email === session?.user?.email,
            )
            .map((r) => (
              <div key={r._id} className="border p-4 rounded">
                <p>{r.senderId?.email} wants to connect</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAccept(r._id)}
                    className="border px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(r._id)}
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
