import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();

  const [skillsHave, setSkillsHave] = useState<string>("");
  const [skillsWant, setSkillsWant] = useState<string>("");
  const [level, setLevel] = useState("Beginner");

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
      email: user?.email,
      skillsHave: skillsHave.split(",").map((s) => s.trim()),
      skillsWant: skillsWant.split(",").map((s) => s.trim()),
      skillLevel: level,
    };

    try {
      await fetch("http://localhost:3000/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Profile completed 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">
          Complete your profile 🚀
        </h1>

        {/* Skills Have */}
        <div className="space-y-2">
          <Label className="text-gray-300">Skills You Have</Label>
          <Input
            placeholder="React, Node, Python"
            value={skillsHave}
            onChange={(e) => setSkillsHave(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Skills Want */}
        <div className="space-y-2">
          <Label className="text-gray-300">Skills You Want</Label>
          <Input
            placeholder="DSA, ML"
            value={skillsWant}
            onChange={(e) => setSkillsWant(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Level */}
        <div className="space-y-2">
          <Label className="text-gray-300">Skill Level</Label>
          <select
            className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option className="text-black">Beginner</option>
            <option className="text-black">Intermediate</option>
            <option className="text-black">Advanced</option>
          </select>
        </div>

        {/* Button */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          onClick={handleSubmit}
        >
          Finish Setup
        </Button>
      </div>
    </div>
  );
}
