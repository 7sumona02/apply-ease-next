"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the options for roles and skills
const DEV_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Mobile Developer",
  "Data Scientist",
  "UI/UX Designer",
];

const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "Docker",
  "AWS",
  "GraphQL",
];

export default function UserInfoForm() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            id: user.id,
            name,
            role,
            skills, // This will be stored as JSONB
          },
          { onConflict: "id" } // Ensure the record is updated if the ID already exists
        )
        .select();

      if (error) throw error;

      alert("User info saved successfully!");
    } catch (error) {
      console.error("Error saving user info: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div>
        <Label htmlFor="name">Name</Label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>

      {/* Role Select */}
      <div>
        <Label htmlFor="role">Role</Label>
        <Select onValueChange={(value) => setRole(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {DEV_ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Skills Select (Multi-select) */}
      <div>
        <Label htmlFor="skills">Skills</Label>
        <Select
          onValueChange={(value) => {
            if (!skills.includes(value)) {
              setSkills([...skills, value]);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your skills" />
          </SelectTrigger>
          <SelectContent>
            {SKILLS.map((skill) => (
              <SelectItem key={skill} value={skill}>
                {skill}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-2 py-1 mr-2 text-sm bg-gray-200 rounded"
            >
              {skill}
              <button
                type="button"
                onClick={() => setSkills(skills.filter((s) => s !== skill))}
                className="ml-2 text-red-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit">Save</Button>
    </form>
  );
}