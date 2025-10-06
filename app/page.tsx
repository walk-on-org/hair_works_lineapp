"use client";

import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { Profile } from "@liff/get-profile";

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
    <main>
      {liff && <p>LIFF init succeeded.</p>}
      {liffError && <p>LIFF init failed.</p>}
      {profile && (
        <>
          <p>Display Name: {profile.displayName}</p>
          <p>User ID: {profile.userId}</p>
          <p>Picture URL: {profile.pictureUrl}</p>
          <p>Status Message: {profile.statusMessage}</p>
        </>
      )}
    </main>
  );
}
