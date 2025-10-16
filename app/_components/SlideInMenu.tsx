"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface SlideInMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SlideInMenu({ isOpen, onClose }: SlideInMenuProps) {
  const items = [
    {
      label: "利用規約",
      href: "/",
      title: "アプリケーションについて",
    },
    {
      label: "プライバシーポリシー",
      href: "/",
      title: "",
    },
  ];

  return (
    <>
      {/* オーバーレイ */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* メニュー */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold">その他・設定</h2>
          </div>

          {/* メニュー項目 */}
          <div className="flex-1">
            <div className="space-y-1">
              {items.map((item, index) => (
                <div key={`${item.label}-${index}`}>
                  {item.title && (
                    <h3 className="font-bold text-sm px-6 py-3 border-b border-gray-100">
                      {item.title}
                    </h3>
                  )}
                  <Link
                    href={item.href}
                    className="text-sm px-7 py-3 border-b border-gray-100 flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronRightIcon
                      className="w-3 h-3 text-red-400"
                      strokeWidth={3}
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
