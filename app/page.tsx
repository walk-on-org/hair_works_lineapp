"use client";

import { useEffect, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import MessageList from "./_components/MessageList";
import {
  loginVerifyToken,
  loginByUserId,
  logout,
} from "@/services/messageService";
import { LoginResponse } from "@/types/message";
import LoginScreen from "./_components/LoginScreen";

export default function Home() {
  const { liff, liffError } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needLogin, setNeedLogin] = useState(false);
  const [lineUserId, setLineUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (liff?.isLoggedIn()) {
        try {
          const profile = await liff.getProfile();
          setLineUserId(profile.userId);
          let res: LoginResponse;
          if (token) {
            // 初回ログイン
            res = await loginVerifyToken(token, profile.userId);
          } else {
            // ログイン済み
            res = await loginByUserId(profile.userId);
          }

          if (res.data.result === 1) {
            // メッセージ一覧表示
            setAccessToken(res.data.access_token);
            setIsLoading(false);

            // URLパラメータのtokenを削除
            if (token) {
              const url = new URL(window.location.href);
              url.searchParams.delete("token");
              window.history.replaceState({}, "", url.toString());
            }
          } else {
            // ログイン画面表示
            setNeedLogin(true);
            setIsLoading(false);
          }
        } catch (error) {
          console.error("ログインに失敗しました:", error);
          // ログイン画面表示
          setNeedLogin(true);
          setIsLoading(false);
        }
      } else {
        liff?.login();
      }
    })();
  }, [liff]);

  const handleLoginSuccess = (token: string, lineUserId: string) => {
    setAccessToken(token);
    setNeedLogin(false);
    setLineUserId(lineUserId);
  };

  const handleLogout = async () => {
    try {
      const res = await logout(lineUserId as string);
      if (res.data.result === 1) {
        setAccessToken("");
        setNeedLogin(true);
        setLineUserId(null);
      }
    } catch (error) {
      console.error("ログアウトに失敗しました:", error);
    }
  };

  return (
    <main className="h-dvh bg-white text-gray-900">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-gray-600">読み込み中...</span>
        </div>
      ) : liffError ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-600">
            初期化に失敗しました。再度読み込みをお試しください。
          </p>
        </div>
      ) : needLogin ? (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <MessageList accessToken={accessToken ?? ""} onLogout={handleLogout} />
      )}
    </main>
  );
}
