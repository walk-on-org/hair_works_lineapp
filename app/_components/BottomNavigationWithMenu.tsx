"use client";

import { useState } from "react";
import BottomNavigation from "./BottomNavigation";
import SlideInMenu from "./SlideInMenu";

interface BottomNavigationWithMenuProps {
  onHomeClick?: () => void;
  onLogout: () => void;
  showJobSearch?: boolean;
}

export default function BottomNavigationWithMenu({
  onHomeClick,
  onLogout,
  showJobSearch = true,
}: BottomNavigationWithMenuProps) {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  // 設定メニューを開く/閉じる
  const handleOpenSettings = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
  };

  const handleCloseSettings = () => {
    setIsSettingsMenuOpen(false);
  };

  return (
    <>
      <BottomNavigation
        onHomeClick={onHomeClick}
        onSettingsClick={handleOpenSettings}
        isSettingsActive={isSettingsMenuOpen}
        showJobSearch={showJobSearch}
      />

      <SlideInMenu
        isOpen={isSettingsMenuOpen}
        onClose={handleCloseSettings}
        onLogout={onLogout}
      />
    </>
  );
}
