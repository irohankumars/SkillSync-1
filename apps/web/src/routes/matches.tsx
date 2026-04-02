import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/components/theme-provider";
import { Sun, Moon } from "lucide-react";

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
  const { theme, setTheme } = useTheme();

  const [tab, setTab] = useState("suggested");
  const [matches, setMatches] = useState<MatchUser[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`http://localhost:3000/matches?email=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          const sorted = data.sort(
            (a: MatchUser, b: MatchUser) => b.matchScore - a.matchScore,
          );
          setMatches(sorted);
        });
    }
  }, [session]);

  const loadRequests = () => {
    fetch("http://localhost:3000/requests")
      .then((res) => res.json())
      .then(setRequests);
  };

  useEffect(() => {
    loadRequests();
  }, []);

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

    loadRequests();
  };

  const handleAccept = async (id: string) => {
    await fetch("http://localhost:3000/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadRequests();
  };

  const handleReject = async (id: string) => {
    await fetch("http://localhost:3000/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadRequests();
  };

  const getStatus = (userEmail: string) => {
    const req = requests.find(
      (r) =>
        (r.senderId?.email === session?.user?.email &&
          r.receiverId?.email === userEmail) ||
        (r.receiverId?.email === session?.user?.email &&
          r.senderId?.email === userEmail),
    );

    return req?.status || null;
  };

  const filteredMatches = matches.filter((user) => {
    const status = getStatus(user.email);
    return status !== "accepted";
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-6 space-y-6">
      {/* 🌙 THEME TOGGLE */}
      <div className="flex justify-end">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="border rounded-lg p-2 hover:bg-muted"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-4 border-b pb-2">
        {["suggested", "connected", "requests"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-md text-sm ${
              tab === t
                ? "bg-blue-600 text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 👥 SUGGESTED */}
      {tab === "suggested" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((user) => {
            const status = getStatus(user.email);

            return (
              <div
                key={user._id}
                className="bg-background border rounded-xl p-4 shadow-sm space-y-2"
              >
                <h3 className="font-semibold">{user.name}</h3>

                <p className="text-xs text-muted-foreground">
                  Has: {user.skillsHave?.join(", ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  Wants: {user.skillsWant?.join(", ")}
                </p>

                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {user.matchScore}% match
                </span>

                {status === "pending" ? (
                  <button className="w-full mt-2 bg-muted text-muted-foreground py-1.5 rounded-md text-sm cursor-not-allowed">
                    Request Sent
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(user.email)}
                    className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded-md text-sm hover:bg-blue-700"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 🤝 CONNECTED */}
      {tab === "connected" && (
        <div className="bg-background border rounded-xl shadow-sm divide-y">
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
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        otherUser?.avatar ||
                        "https://ui-avatars.com/api/?name=" + otherUser?.name
                      }
                      className="w-11 h-11 rounded-full"
                    />

                    <div>
                      <p className="font-medium text-sm">{otherUser?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {otherUser?.skillsHave?.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/chat/${otherUser?.email}`)}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-700"
                  >
                    Chat
                  </button>
                </div>
              );
            })}

          {requests.filter(
            (r) =>
              r.status === "accepted" &&
              (r.senderId?.email === session?.user?.email ||
                r.receiverId?.email === session?.user?.email),
          ).length === 0 && (
            <p className="p-4 text-sm text-muted-foreground text-center">
              No connections yet
            </p>
          )}
        </div>
      )}

      {/* 📥 REQUESTS */}
      {tab === "requests" && (
        <div className="space-y-3">
          {requests
            .filter(
              (r) =>
                r.status === "pending" &&
                r.receiverId?.email === session?.user?.email,
            )
            .map((r) => (
              <div key={r._id} className="bg-background border rounded-xl p-4">
                <p className="text-sm font-medium">
                  {r.senderId?.name || r.senderId?.email}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAccept(r._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(r._id)}
                    className="border px-3 py-1 rounded-md text-sm hover:bg-muted"
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
