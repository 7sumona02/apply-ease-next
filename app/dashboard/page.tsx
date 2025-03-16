"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import UserInfoForm from "@/components/UserInfoForm";

// Define the UserInfo type
interface UserInfo {
  id: string;
  name: string;
  role: string;
  skills: string[]; // skills is now an array
}

export default function Page() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user info: ", error);
      } else {
        setUserInfo(data);
      }
    };

    fetchUserInfo();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4">
        <UserButton afterSignOutUrl="/" />
      </div>
      {!userInfo ? (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Please provide your information</h2>
          <UserInfoForm />
        </div>
      ) : (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Your Information</h2>
          <p>Name: {userInfo.name}</p>
          <p>Role: {userInfo.role}</p>
          <p>Skills: {userInfo.skills.join(", ")}</p>
        </div>
      )}
    </div>
  );
}