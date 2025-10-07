"use client";

import { useState, useEffect } from "react";
import MessageDetail from "./MessageDetail";
import { Applicant } from "@/types/message";
import { fetchApplicantMessageList } from "@/services/messageService";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";

export default function MessageList() {
  const { liff } = useGlobalContext();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  // メッセージ一覧を取得
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedApplicants: Applicant[] = [];

        // LIFFが利用可能でログインしている場合は認証付きでAPI呼び出し
        if (liff && liff.isLoggedIn()) {
          const accessToken = liff.getAccessToken();
          fetchedApplicants = await fetchApplicantMessageList(
            "4UukdhjBF9tk46rKaDG5OgES6ONG6ur6t5Q0ZUc7RgLMY7Aj"
          );
        }

        setApplicants(fetchedApplicants);
      } catch (err) {
        console.error("メッセージの読み込みに失敗:", err);
        setError("メッセージの読み込みに失敗しました");
        // エラー時はサンプルデータを表示
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [liff]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    // 同じ日かどうかを判定する関数
    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );
    };

    if (isSameDay(date, now)) {
      // 同じ日の場合は、時間を表示
      return date.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      // 7日前未満は、何日前かを表示
      return `${diffDays}日前`;
    } else {
      // 7日前以上は、日付を表示
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const handleMessageClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleBackToList = () => {
    setSelectedApplicant(null);
  };

  const handleSendMessage = (content: string) => {
    console.log(`メッセージを送信: ${content}`);
    // ここで実際のメッセージ送信処理を実装
  };

  // メッセージ詳細ページを表示
  if (selectedApplicant) {
    return (
      <MessageDetail
        applicant={selectedApplicant}
        onBack={handleBackToList}
        onSendMessage={handleSendMessage}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto flex flex-col h-screen">
      {/* ヘッダー */}
      <div className="p-6 border-b border-blue-400">
        <h1 className="text-xl font-bold text-center">宛先</h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8 flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-gray-600">読み込み中...</span>
        </div>
      )}

      {/* メッセージ一覧 */}
      {!loading && (
        <div className="divide-y divide-gray-200 flex-1">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleMessageClick(applicant)}
            >
              <div className="flex items-center space-x-3">
                {/* アバター */}
                <div className="flex-shrink-0">
                  <img
                    src={
                      process.env.NEXT_PUBLIC_API_BASE_URL + applicant.image.url
                    }
                    alt={applicant.office_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>

                {/* メッセージ情報 */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {applicant.office_name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {applicant.messages[0] && applicant.messages[0].message}
                  </p>
                </div>

                {/* 日付・未読バッジ */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500">
                    {formatTime(new Date(applicant.last_activity))}
                  </span>
                  {applicant.unread_count > 0 && (
                    <span className="inline-flex items-center justify-center aspect-square px-2 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {applicant.unread_count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 空状態 */}
      {!loading && applicants.length === 0 && (
        <div className="text-center py-8 flex-1">
          <p className="text-gray-500">メッセージがありません</p>
        </div>
      )}

      <div className="py-3 border-t border-gray-200">
        <div className="flex justify-around">
          <div
            className="flex flex-col items-center gap-1"
            onClick={handleBackToList}
          >
            <div className="rounded-full bg-blue-400/20 px-4 py-2">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-blue-600">宛先</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="rounded-full bg-blue-400/20 px-4 py-2">
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs font-medium text-blue-600">TODO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
