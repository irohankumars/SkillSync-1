import "dotenv/config";
import mongoose from "mongoose";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { auth } from "@SkillSync-1/auth";
import { env } from "@SkillSync-1/env/server";
import { Message } from "./models/message.model.js";

import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  wrapLanguageModel,
} from "ai";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import dns from "dns";
import { createServer } from "http";
import { Server } from "socket.io";

import { User } from "./models/user.model";
import { Request } from "./models/request.model";

dns.setDefaultResultOrder("ipv4first");

const app = express();

// ✅ DB CONNECT
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL!);
    console.log("DB connected ✅");
  } catch (err) {
    console.error("DB error ❌", err);
  }
};

await connectDB();

// ✅ CORS FIX (IMPORTANT 🔥)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ exact frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // ✅ required for auth
  }),
);

app.use(express.json());

app.all("/api/auth{/*path}", toNodeHandler(auth));

// 🤖 AI
app.post("/ai", async (req, res) => {
  const { messages = [] } = (req.body || {}) as { messages: UIMessage[] };

  const model = wrapLanguageModel({
    model: google("gemini-2.5-flash"),
    middleware: devToolsMiddleware(),
  });

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
  });

  result.pipeUIMessageStreamToResponse(res);
});

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

// =======================
// 🔥 SkillSync APIs
// =======================

// 🧠 match logic
function calculateMatch(user1: any, user2: any) {
  const haveWant1 = user1.skillsHave.filter((s: string) =>
    user2.skillsWant.includes(s),
  );

  const haveWant2 = user2.skillsHave.filter((s: string) =>
    user1.skillsWant.includes(s),
  );

  const sameHave = user1.skillsHave.filter((s: string) =>
    user2.skillsHave.includes(s),
  );

  const sameWant = user1.skillsWant.filter((s: string) =>
    user2.skillsWant.includes(s),
  );

  let score = 0;

  if (haveWant1.length && haveWant2.length) score += 60;
  if (haveWant1.length || haveWant2.length) score += 20;
  if (sameHave.length) score += 10;
  if (sameWant.length) score += 10;

  if (score === 0) score = 5;

  return Math.min(score, 100);
}

// ✅ MATCHES
app.get("/matches", async (req, res) => {
  const email = req.query.email;

  const currentUser = await User.findOne({ email });
  if (!currentUser) return res.json([]);

  const users = await User.find();

  const matches = users
    .filter((u) => u._id.toString() !== currentUser._id.toString())
    .map((u) => ({
      ...u.toObject(),
      matchScore: calculateMatch(currentUser, u),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json(matches);
});

// ✅ CONNECT
// ✅ CONNECT (FIXED)
app.post("/connect", async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  try {
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // prevent duplicate request
    const existing = await Request.findOne({
      senderId: sender._id,
      receiverId: receiver._id,
    });

    if (existing) {
      return res.json({ message: "Already sent" });
    }

    await Request.create({
      senderId: sender._id,
      receiverId: receiver._id,
      status: "pending",
    });

    res.json({ message: "Request sent 🚀" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

// ✅ GET REQUESTS
app.get("/requests", async (_req, res) => {
  const requests = await Request.find()
    .populate("senderId", "name email")
    .populate("receiverId", "name email");

  res.json(requests);
});

// ✅ ACCEPT
app.post("/accept", async (req, res) => {
  const { id } = req.body;

  await Request.findByIdAndUpdate(id, { status: "accepted" });

  res.json({ message: "Accepted" });
});

// ✅ REJECT
app.post("/reject", async (req, res) => {
  const { id } = req.body;

  await Request.findByIdAndUpdate(id, { status: "rejected" });

  res.json({ message: "Rejected" });
});

// ✅ ONBOARDING
app.post("/api/user/onboarding", async (req, res) => {
  const { email, skillsHave, skillsWant, skillLevel } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name: email.split("@")[0],
        skillsHave,
        skillsWant,
        skillLevel,
      });
    } else {
      user.skillsHave = skillsHave;
      user.skillsWant = skillsWant;
      user.skillLevel = skillLevel;
      await user.save();
    }

    res.json({ message: "Profile saved ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed" });
  }
});

// =======================
// 🔥 SOCKET.IO FIX
// =======================

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // ✅ FIXED
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", async (roomId) => {
    socket.join(roomId);

    const messages = await Message.find({ room: roomId });
    socket.emit("chat_history", messages);
  });

  socket.on("send_message", async (data) => {
    await Message.create(data);
    io.to(data.room).emit("receive_message", data);
  });
});

app.get("/me", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

// ✅ UPDATE PROFILE
app.post("/update-profile", async (req, res) => {
  const { email, name, bio, skillsHave, skillsWant, avatar } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name;
    user.bio = bio;
    user.skillsHave = skillsHave;
    user.skillsWant = skillsWant;
    // user.avatar = avatar;

    await user.save();

    res.json({ message: "Profile updated ✅", user });
  } catch (err) {
    res.status(500).json({ error: "Failed to update" });
  }
});

app.post("/start-session", async (req, res) => {
  const { email } = req.body;

  await User.findOneAndUpdate(
    { email },
    {
      $inc: {
        sessionsCompleted: 1,
        streak: 1,
      },
    },
  );

  res.json({ success: true });
});

// =======================
// 🚀 START SERVER
// =======================

httpServer.listen(3000, () => {
  console.log("Server running 🚀 http://localhost:3000");
});
