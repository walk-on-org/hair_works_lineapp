"use client";

import { useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginByEmail } from "@/services/messageService";
import Image from "next/image";
import toast from "react-hot-toast";

interface FormData {
  email: string;
  password: string;
}

interface LoginScreenProps {
  onLoginSuccess: (accessToken: string, lineUserId: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { liff } = useGlobalContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      const profile = await liff?.getProfile();
      const response = await loginByEmail(
        data.email,
        data.password,
        profile?.userId ?? ""
      );

      if (response.data && response.data.result === 0) {
        throw new Error(response.data.message ?? "ログインに失敗しました");
      } else if (response.data.access_token) {
        onLoginSuccess(response.data.access_token, profile?.userId ?? "");
      } else {
        throw new Error("ログインに失敗しました");
      }
    } catch (error) {
      toast.error((error as Error).message, {
        style: {
          border: "1px solid #ff0000",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
      console.error("ログインエラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto flex flex-col h-full">
      {/* ヘッダー */}
      <div className="px-6 py-2 border-b border-blue-green">
        <Image src="/logo/main_logo_3.png" alt="logo" width={140} height={40} />
      </div>

      <div className="px-4 py-3 flex flex-col gap-6">
        {/* 説明文 */}
        <div className="flex flex-col gap-1 text-center">
          <p className="bg-blue-green/20 font-bold text-lg p-2">
            LINEによるHAIR WORKS応募先サロン
            <br />
            とのメッセージ連携
          </p>
          <p className="text-xs">
            このサービスをご利用になるには、ログインが必要です。
          </p>
        </div>

        {/* ログインフォーム */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "メールアドレスを入力してください",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              placeholder="パスワードを入力"
              {...register("password", {
                required: "パスワードを入力してください",
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-green hover:bg-this-green disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-bold transition-colors duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>

          <div className="text-center">
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_URL}/user/password_reset_request`}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              パスワードを忘れた方はこちら
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
