"use client";

import { useOrientation } from "@/hooks/useOrientation";
import BottomNavigationWithMenu from "@/app/_components/BottomNavigationWithMenu";
import { useRouter } from "next/navigation";

export default function PrivacyPolicy() {
  const isLandscape = useOrientation();
  const router = useRouter();

  // ホームボタンのクリック処理
  const handleHomeClick = () => {
    router.push("/");
  };

  // ログアウト処理（プライバシーポリシーページでは特に何もしない）
  const handleLogout = () => {
    // 必要に応じてログアウト処理を実装
    console.log("ログアウト");
  };

  return (
    <main
      className={`h-dvh bg-white text-gray-900 ${
        isLandscape ? "pb-[22px] px-[44px]" : "pb-[34px]"
      }`}
    >
      <div className="w-full mx-auto flex flex-col h-full ">
        {/* ヘッダー */}
        <div className="px-6 py-4 bg-[url(/title_background_watercolor_pattern01.jpg)]">
          <h1 className="text-lg font-bold text-center">
            プライバシーポリシー
          </h1>
        </div>

        {/* プライバシーポリシー */}
        <div className="px-4 py-3 flex-1">
          <p>プライバシーポリシーはこちらをご覧ください。</p>
        </div>

        {/* 下部ナビゲーション */}
        <BottomNavigationWithMenu
          onHomeClick={handleHomeClick}
          onLogout={handleLogout}
          showJobSearch={true}
        />
      </div>
    </main>
  );
}
