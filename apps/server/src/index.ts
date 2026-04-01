import "dotenv/config";
import mongoose from "mongoose";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import { auth } from "@SkillSync-1/auth";
import { env } from "@SkillSync-1/env/server";
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
import { User } from "./models/user.model";

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

// ✅ MIDDLEWARES
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
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
// 🔥 SkillSync APIs START
// =======================

let requests: any[] = [];

// 🧠 match logic
function calculateMatch(user1: any, user2: any) {
  const common = user1.skillsHave.filter((s: string) =>
    user2.skillsWant.includes(s),
  );
  return Math.floor((common.length / user2.skillsWant.length) * 100) || 50;
}

// ✅ GET matches (fixed)
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
    }));

  res.json(matches);
});

// ✅ GET current user
app.get("/me", async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
});

// ✅ GET dashboard
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({});

  res.json({
    name: user.name,
    streak: user.streak,
    sessions: user.sessionsCompleted,
    progress: Math.min(user.sessionsCompleted * 5, 100),
  });
});

// ✅ dashboard matches
app.get("/dashboard-matches", async (req, res) => {
  const email = req.query.email;

  const currentUser = await User.findOne({ email });
  if (!currentUser) return res.json([]);

  const users = await User.find();

  const matches = users
    .filter((u) => u._id.toString() !== currentUser._id.toString())
    .slice(0, 2)
    .map((u) => ({
      _id: u._id,
      name: u.name,
      skillsHave: u.skillsHave,
      skillsWant: u.skillsWant,
      matchScore: calculateMatch(currentUser, u),
    }));

  res.json(matches);
});

// ✅ connect
app.post("/connect", (req, res) => {
  const { userId } = req.body;

  requests.push({
    id: Date.now(),
    senderId: 1,
    receiverId: userId,
    status: "pending",
  });

  res.json({ message: "Request sent" });
});

// ✅ get requests
app.get("/requests", (_req, res) => {
  res.json(requests);
});

// ✅ accept
app.post("/accept", (req, res) => {
  const { id } = req.body;

  requests = requests.map((r) =>
    r.id === id ? { ...r, status: "accepted" } : r,
  );

  res.json({ message: "Accepted" });
});

// ✅ reject
app.post("/reject", (req, res) => {
  const { id } = req.body;

  requests = requests.map((r) =>
    r.id === id ? { ...r, status: "rejected" } : r,
  );

  res.json({ message: "Rejected" });
});

// =======================
// 🔥 SkillSync APIs END
// =======================

app.listen(3000, () => {
  console.log("Server running 🚀 http://localhost:3000");
});
