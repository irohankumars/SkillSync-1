import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
    },

    skillsHave: [
      {
        type: String,
      },
    ],

    skillsWant: [
      {
        type: String,
      },
    ],

    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    streak: {
      type: Number,
      default: 0,
    },

    sessionsCompleted: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
