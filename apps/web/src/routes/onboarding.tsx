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
      email: user?.email, // 🔥 FIX
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
    <div className="max-w-md mx-auto mt-10 p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Complete your profile</h1>

      <div>
        <Label>Skills You Have (comma separated)</Label>
        <Input
          placeholder="React, Node, Python"
          value={skillsHave}
          onChange={(e) => setSkillsHave(e.target.value)}
        />
      </div>

      <div>
        <Label>Skills You Want</Label>
        <Input
          placeholder="DSA, ML"
          value={skillsWant}
          onChange={(e) => setSkillsWant(e.target.value)}
        />
      </div>

      <div>
        <Label>Skill Level</Label>
        <select
          className="w-full p-2 border rounded-md bg-black"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <Button className="w-full" onClick={handleSubmit}>
        Finish Setup
      </Button>
    </div>
  );
}
