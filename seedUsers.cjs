const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/SkillSync";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  bio: String,
  skillsHave: [String],
  skillsWant: [String],
  skillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  streak: { type: Number, default: 0 },
  sessionsCompleted: { type: Number, default: 0 },
  badges: [String],
});

const User = mongoose.model("User", userSchema);

const users = [
  {
    name: "Rohan",
    email: "kumarsrohan978@gmail.com",
    bio: "Aspiring full-stack dev 🚀",
    skillsHave: ["React", "Node", "MongoDB"],
    skillsWant: ["AI", "System Design"],
    skillLevel: "Intermediate",
    streak: 6,
    sessionsCompleted: 15,
    badges: ["consistent-learner"],
  },
  {
    name: "Aman",
    email: "aman@gmail.com",
    bio: "ML enthusiast",
    skillsHave: ["Python", "ML"],
    skillsWant: ["React"],
    skillLevel: "Advanced",
    streak: 10,
    sessionsCompleted: 30,
    badges: ["ml-pro"],
  },
  {
    name: "Neha",
    email: "neha@gmail.com",
    bio: "UI/UX designer",
    skillsHave: ["Figma", "Design"],
    skillsWant: ["Frontend"],
    skillLevel: "Beginner",
    streak: 3,
    sessionsCompleted: 8,
    badges: [],
  },
  {
    name: "Karan",
    email: "karan@gmail.com",
    bio: "Backend dev",
    skillsHave: ["Node", "MongoDB"],
    skillsWant: ["DevOps"],
    skillLevel: "Intermediate",
    streak: 5,
    sessionsCompleted: 12,
    badges: ["backend-guy"],
  },
  {
    name: "Priya",
    email: "priya@gmail.com",
    bio: "Frontend learner",
    skillsHave: ["HTML", "CSS"],
    skillsWant: ["React"],
    skillLevel: "Beginner",
    streak: 2,
    sessionsCompleted: 5,
    badges: [],
  },
  {
    name: "Rahul",
    email: "rahul@gmail.com",
    bio: "Java dev",
    skillsHave: ["Java"],
    skillsWant: ["Spring Boot"],
    skillLevel: "Intermediate",
    streak: 4,
    sessionsCompleted: 10,
    badges: ["java-dev"],
  },
  {
    name: "Sneha",
    email: "sneha@gmail.com",
    bio: "DSA focused",
    skillsHave: ["C++"],
    skillsWant: ["DSA"],
    skillLevel: "Intermediate",
    streak: 7,
    sessionsCompleted: 18,
    badges: ["problem-solver"],
  },
  {
    name: "Arjun",
    email: "arjun@gmail.com",
    bio: "Next.js dev",
    skillsHave: ["Next.js"],
    skillsWant: ["Backend"],
    skillLevel: "Intermediate",
    streak: 6,
    sessionsCompleted: 14,
    badges: [],
  },
  {
    name: "Meera",
    email: "meera@gmail.com",
    bio: "AI curious",
    skillsHave: ["Python"],
    skillsWant: ["AI"],
    skillLevel: "Beginner",
    streak: 3,
    sessionsCompleted: 6,
    badges: [],
  },
  {
    name: "Vikram",
    email: "vikram@gmail.com",
    bio: "DevOps learner",
    skillsHave: ["Docker"],
    skillsWant: ["Kubernetes"],
    skillLevel: "Intermediate",
    streak: 5,
    sessionsCompleted: 11,
    badges: ["docker-user"],
  },
];
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("DB connected");

  await User.deleteMany();
  await User.insertMany(users);

  console.log("✅ Done");
  process.exit();
}

seed();