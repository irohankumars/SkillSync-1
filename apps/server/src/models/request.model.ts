import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Request = mongoose.model("Request", requestSchema);
