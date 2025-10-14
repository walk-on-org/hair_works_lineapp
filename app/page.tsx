"use client";

import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { Profile } from "@liff/get-profile";
import MessageList from "./_components/MessageList";
import toast from "react-hot-toast";
import { loginVerifyToken, login } from "@/services/messageService";
import { LoginResponse } from "@/types/message";

export default function Home() {
  const { liff, liffError } = useGlobalContext();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (liff?.isLoggedIn()) {
        try {
          const profile = await liff.getProfile();
          setProfile(profile);
          let res: LoginResponse;
          if (token) {
            // 初回ログイン
            res = await loginVerifyToken(token, profile.userId);
          } else {
            // ログイン済み
            res = await login(profile.userId);
          }

          if (res.data.result === 1) {
            setAccessToken(res.data.access_token);
          } else {
            toast.error(res.data.message ?? "ログインに失敗しました", {
              style: {
                border: "1px solid #ff0000",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "bold",
              },
            });
          }
        } catch (error) {
          console.error("ログインに失敗しました:", error);
          toast.error("ログインに失敗しました", {
            style: {
              border: "1px solid #ff0000",
              padding: "12px 16px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "bold",
            },
          });
        }
      } else {
        liff?.login();
      }
    })();
  }, [liff]);

  return (
    <main className="h-dvh bg-white text-gray-900">
      {liffError ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">
            初期化に失敗しました。再度読み込みをお試しください。
          </p>
        </div>
      ) : (
        <MessageList accessToken={accessToken ?? ""} />
      )}
    </main>
  );
}
