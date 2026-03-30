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
import { User } from "./models/user.model";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.all("/api/auth{/*path}", toNodeHandler(auth));

app.use(express.json());

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

// import mongoose from "mongoose";

let requests: any[] = [];

// 🧠 match logic
function calculateMatch(user1: any, user2: any) {
  const common = user1.skillsHave.filter((s: string) =>
    user2.skillsWant.includes(s),
  );
  return Math.floor((common.length / user2.skillsWant.length) * 100) || 50;
}

// ✅ GET matches
app.get("/matches", async (_req, res) => {
  const users = await User.find(); // ✅ works now

  const currentUser = users[0]!;

  const matches = users
    .filter((u) => u._id.toString() !== currentUser._id.toString())
    .map((u) => ({
      ...u.toObject(),
      matchScore: calculateMatch(currentUser, u),
    }));

  res.json(matches);
});

// ✅ POST connect
app.post("/connect", (req, res) => {
  const { userId } = req.body;

  requests.push({
    id: Date.now(),
    senderId: 1, // current user
    receiverId: userId,
    status: "pending",
  });

  res.json({ message: "Request sent" });
});

// ✅ GET requests
app.get("/requests", (_req, res) => {
  res.json(requests);
});

// ✅ POST accept
app.post("/accept", (req, res) => {
  const { id } = req.body;

  requests = requests.map((r) =>
    r.id === id ? { ...r, status: "accepted" } : r,
  );

  res.json({ message: "Accepted" });
});

// ✅ POST reject
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
  console.log("Server is running on http://localhost:3000");
});
