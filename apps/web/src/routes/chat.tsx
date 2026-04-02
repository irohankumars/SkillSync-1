import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router";
import { authClient } from "@/lib/auth-client";
import { io, Socket } from "socket.io-client";
import { Phone, Video, Mic, Image, Smile, Plus } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

type Message = {
  sender: string;
  text: string;
  room: string;
};

export default function Chat() {
  const { id } = useParams();
  const location = useLocation();
  const { data: session } = authClient.useSession();

  const currentUser = session?.user?.email || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const otherUser = location.state?.user;

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const room = currentUser && id ? [currentUser, id].sort().join("-") : "";

  // SOCKET INIT
  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // JOIN ROOM
  useEffect(() => {
    if (!room || !socketRef.current) return;

    const socket = socketRef.current;

    socket.emit("join_room", room);

    socket.on("chat_history", (data: Message[]) => {
      setMessages(data);
    });

    socket.on("receive_message", (data: Message) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [room]);

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE (FIXED ❌ removed duplicate push)
  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const msg: Message = {
      sender: currentUser,
      text: input,
      room,
    };

    socketRef.current.emit("send_message", msg);
    setInput("");
  };

  // VIDEO CALL (FIXED ❌ removed duplicate push)
  const handleVideoCall = async () => {
    try {
      const meetLink = "https://meet.google.com/new";

      // update session
      await fetch("http://localhost:3000/start-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
        }),
      });

      // send link message
      const msg: Message = {
        sender: currentUser,
        text: `📹 Join video call: ${meetLink}`,
        room,
      };

      socketRef.current?.emit("send_message", msg);

      // open meet
      window.open(meetLink, "_blank");
    } catch (err) {
      console.error("Video call error", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[90vh] flex flex-col border rounded-lg overflow-hidden relative">
      {/* HEADER */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-3">
          <img
            src={otherUser?.avatar || "https://via.placeholder.com/40"}
            className="w-10 h-10 rounded-full"
          />

          <div>
            <p className="font-semibold">{otherUser?.name || id}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Phone size={20} />

          <Video
            size={20}
            className="cursor-pointer hover:text-blue-500"
            onClick={handleVideoCall}
          />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-xs ${
              msg.sender === currentUser
                ? "ml-auto bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {/* clickable video link */}
            {msg.text.includes("http") ? (
              <a
                href={msg.text.split(" ").pop()}
                target="_blank"
                className="underline text-blue-700"
              >
                📹 Join Video Call
              </a>
            ) : (
              msg.text
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div className="absolute bottom-20 right-4 z-50">
          <EmojiPicker
            onEmojiClick={(e) => setInput((prev) => prev + e.emoji)}
          />
        </div>
      )}

      {/* INPUT BAR */}
      <div className="p-2 border-t flex items-center gap-2">
        <Plus size={20} />

        <div className="flex-1 flex items-center border rounded-full px-3 py-1">
          <input
            className="flex-1 bg-transparent outline-none px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <Smile
            size={18}
            className="cursor-pointer"
            onClick={() => setShowEmoji((p) => !p)}
          />
        </div>

        <Mic size={20} />
        <Image size={20} />

        <button onClick={sendMessage} className="text-blue-500 font-semibold">
          Send
        </button>
      </div>
    </div>
  );
}
