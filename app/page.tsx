"use client";

import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { Profile } from "@liff/get-profile";
import MessageList from "./_components/MessageList";

export default function Home() {
  const { liff, liffError } = useGlobalContext();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (liff?.isLoggedIn()) {
      (async () => {
        const profile = await liff.getProfile();
        setProfile(profile);
      })();
    } else {
      liff?.login();
    }
  }, [liff]);

  return (
    <main className="min-h-screen bg-gray-100">
      {liffError ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">LIFF初期化に失敗しました</p>
        </div>
      ) : (
        <MessageList />
      )}
    </main>
  );
}
