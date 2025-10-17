"use client";

import {
  HomeIcon,
  MagnifyingGlassIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/outline";

interface BottomNavigationProps {
  onHomeClick?: () => void;
  onSettingsClick?: () => void;
  isSettingsActive?: boolean;
  showJobSearch?: boolean;
}

export default function BottomNavigation({
  onHomeClick,
  onSettingsClick,
  isSettingsActive = false,
  showJobSearch = true,
}: BottomNavigationProps) {
  return (
    <div className="py-1 border-t border-gray-200 relative z-50 bg-white">
      <div className="flex justify-around">
        {/* ホーム */}
        <div
          className="flex flex-col items-center gap-1 justify-center w-18 cursor-pointer"
          onClick={onHomeClick}
        >
          <div className="rounded-full px-4 py-1">
            <HomeIcon className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold">ホーム</p>
        </div>

        {/* 求人を見る（オプション） */}
        {showJobSearch && (
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_URL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 justify-center w-18"
          >
            <div className="rounded-full px-4 py-1">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">求人を見る</p>
          </a>
        )}

        {/* その他/設定 */}
        <div
          className="flex flex-col items-center gap-1 justify-center w-18 cursor-pointer"
          onClick={onSettingsClick}
        >
          <div className="rounded-full px-4 py-1">
            <Cog8ToothIcon
              className={`w-5 h-5 ${!isSettingsActive && "text-gray-400"}`}
            />
          </div>
          <p
            className={`text-xs ${
              isSettingsActive ? "font-bold" : "text-gray-500"
            }`}
          >
            その他/設定
          </p>
        </div>
      </div>
    </div>
  );
}
