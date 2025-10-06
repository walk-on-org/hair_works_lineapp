"use client";

import { useState, useEffect } from "react";
import MessageDetail from "./MessageDetail";
import { Message, Applicant } from "@/types/message";
import { fetchApplicantMessageList } from "@/services/messageService";
import { useGlobalContext } from "@/hooks/useGlobalContext";

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

    if (diffHours < 1) {
      return "今";
    } else if (diffHours < 24) {
      return `${diffHours}時間前`;
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
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

  // ローディング状態
  if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white shadow-lg">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">メッセージ</h1>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">読み込み中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg">
      {/* ヘッダー */}
      <div className="bg-blue-600 text-white p-4">
        <h1 className="text-xl font-bold">メッセージ</h1>
        {error && (
          <p className="text-sm text-red-200 mt-1">
            ※ サンプルデータを表示しています
          </p>
        )}
      </div>

      {/* メッセージ一覧 */}
      <div className="divide-y divide-gray-200">
        {applicants.map((applicant) => (
          <div
            key={applicant.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => handleMessageClick(applicant)}
          >
            <div className="flex items-start space-x-3">
              {/* アバター */}
              <div className="flex-shrink-0">
                <img
                  src={
                    process.env.NEXT_PUBLIC_API_BASE_URL + applicant.image.url
                  }
                  alt={applicant.office_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>

              {/* メッセージ情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {applicant.office_name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatTime(new Date(applicant.created_at))}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1 truncate">
                  {applicant.messages[0] && applicant.messages[0].message}
                </p>
              </div>

              {/* 未読バッジ */}
              {applicant.unread_count > 0 && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {applicant.unread_count}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 空状態 */}
      {applicants.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">メッセージがありません</p>
        </div>
      )}
    </div>
  );
}
