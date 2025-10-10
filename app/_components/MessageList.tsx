"use client";

import { useState, useEffect } from "react";
import MessageDetail from "./MessageDetail";
import { Applicant, Message } from "@/types/message";
import {
  fetchApplicantMessageList,
  sendMessage,
  removeMessage,
  alreadyReadMessage,
} from "@/services/messageService";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function MessageList() {
  const { liff } = useGlobalContext();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmedQuery, setConfirmedQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    number | null
  >(null);

  const accessToken = "4UukdhjBF9tk46rKaDG5OgES6ONG6ur6t5Q0ZUc7RgLMY7Aj";

  // メッセージ一覧を取得
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);

        let fetchedApplicants: Applicant[] = [];

        // LIFFが利用可能でログインしている場合は認証付きでAPI呼び出し
        if (liff && liff.isLoggedIn()) {
          fetchedApplicants = await fetchApplicantMessageList(accessToken);
        }

        setApplicants(fetchedApplicants);
      } catch (err) {
        console.error("メッセージの読み込みに失敗:", err);
        toast.error("メッセージの読み込みに失敗しました", {
          style: {
            border: "1px solid #ff0000",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "bold",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [liff]);

  // 日時フォーマット
  const formatDateTime = (date: Date) => {
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

  // 宛先クリック
  const handleMessageClick = async (applicant: Applicant) => {
    try {
      // 選択した宛先を設定
      setSelectedApplicant(applicant);
      // 検索でヒットしたメッセージIDを取得
      const messageId = getMatchedMessageId(applicant, confirmedQuery);
      setHighlightedMessageId(messageId);
      // 既読処理
      const fetchedApplicants: Applicant[] = await alreadyReadMessage(
        applicant.id,
        accessToken
      );
      setApplicants(fetchedApplicants);
    } catch (err) {
      console.error("メッセージの既読に失敗:", err);
    }
  };

  // 宛先一覧に戻る
  const handleBackToList = () => {
    // 選択した宛先を解除
    setSelectedApplicant(null);
    // ハイライトをリセット
    setHighlightedMessageId(null);
  };

  // メッセージ送信
  const handleSendMessage = async (
    applicantId: number,
    message: string
  ): Promise<Message[]> => {
    try {
      // 送信API
      const fetchedApplicants: Applicant[] = await sendMessage(
        applicantId,
        message,
        null,
        "text",
        accessToken
      );
      // 送信後の一覧を更新
      setApplicants(fetchedApplicants);
      // 送信後のメッセージ履歴
      const fetchedApplicant = fetchedApplicants.find(
        (applicant) => applicant.id === applicantId
      );
      return fetchedApplicant?.messages ?? [];
    } catch (err) {
      console.error("メッセージの送信に失敗:", err);
      toast.error("メッセージの送信に失敗しました", {
        style: {
          border: "1px solid #ff0000",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
      return selectedApplicant?.messages ?? [];
    }
  };

  // メッセージ削除
  const handleRemoveMessage = async (
    applicantId: number,
    messageId: number
  ): Promise<Message[]> => {
    try {
      // 削除API
      const fetchedApplicants: Applicant[] = await removeMessage(
        applicantId,
        messageId,
        accessToken
      );
      // 削除後の一覧を更新
      setApplicants(fetchedApplicants);
      // 削除後のメッセージ履歴
      const fetchedApplicant = fetchedApplicants.find(
        (applicant) => applicant.id === applicantId
      );
      return fetchedApplicant?.messages ?? [];
    } catch (err) {
      console.error("メッセージの削除に失敗:", err);
      toast.error("メッセージの削除に失敗しました", {
        style: {
          border: "1px solid #ff0000",
          padding: "12px 16px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
      return selectedApplicant?.messages ?? [];
    }
  };

  // 宛先一覧に表示する最新メッセージを取得
  const getLastMessage = (applicant: Applicant) => {
    const validMessages: Message[] = applicant.messages.filter(
      (message) => !message.deleted_at
    );
    if (validMessages.length === 0) {
      return "";
    }

    let message = "";
    const lastMessage: Message = validMessages[validMessages.length - 1];
    if (lastMessage.sender_type === 2) {
      message += "You：";
    }
    if (lastMessage.content_type === "text") {
      message += lastMessage.message;
    } else {
      message += "ファイルを送信しました";
    }

    return message;
  };

  // メッセージが検索クエリにマッチするかどうかを判定（共通関数）
  const isMessageMatch = (message: Message, query: string): boolean => {
    if (!query) {
      return false;
    }
    if (message.content_type === "text" && message.message) {
      return message.message.toLowerCase().includes(query.toLowerCase());
    }
    return false;
  };

  // 検索にヒットしたメッセージを取得（最新から検索）
  const findMatchedMessage = (
    applicant: Applicant,
    query: string
  ): Message | null => {
    if (!query) {
      return null;
    }

    const validMessages: Message[] = applicant.messages.filter(
      (message) => !message.deleted_at
    );

    // 最新のメッセージから検索クエリにマッチするものを探す
    return (
      [...validMessages]
        .reverse()
        .find((message) => isMessageMatch(message, query)) || null
    );
  };

  // 検索にヒットしたメッセージのIDを取得
  const getMatchedMessageId = (
    applicant: Applicant,
    query: string
  ): number | null => {
    const matchedMessage = findMatchedMessage(applicant, query);
    return matchedMessage ? matchedMessage.id : null;
  };

  // 検索にヒットしたメッセージをハイライト付きで返す
  const renderMatchedMessage = (applicant: Applicant, query: string) => {
    if (!query) {
      return getLastMessage(applicant);
    }

    const matchedMessage = findMatchedMessage(applicant, query);

    if (matchedMessage && matchedMessage.message) {
      const messageText = matchedMessage.message;
      const lowerMessageText = messageText.toLowerCase();
      const lowerQuery = query.toLowerCase();
      const matchIndex = lowerMessageText.indexOf(lowerQuery);

      if (matchIndex !== -1) {
        // ヒットした箇所の前後を取得（前後15文字程度）
        const contextLength = 15;
        const startIndex = Math.max(0, matchIndex - contextLength);
        const endIndex = Math.min(
          messageText.length,
          matchIndex + query.length + contextLength
        );

        let prefix = "";
        if (matchedMessage.sender_type === 2) {
          prefix = "You：";
        }

        // 前の省略
        const beforeText = startIndex > 0 ? "..." : "";

        // ヒット前のテキスト
        const preMatchText = messageText.substring(startIndex, matchIndex);

        // ヒット箇所
        const matchText = messageText.substring(
          matchIndex,
          matchIndex + query.length
        );

        // ヒット後のテキスト
        const postMatchText = messageText.substring(
          matchIndex + query.length,
          endIndex
        );

        // 後ろの省略
        const afterText = endIndex < messageText.length ? "..." : "";

        return (
          <>
            {prefix}
            {beforeText}
            {preMatchText}
            <span className="bg-yellow-200 font-semibold">{matchText}</span>
            {postMatchText}
            {afterText}
          </>
        );
      }
    }

    // ヒットしたメッセージがない場合は最新メッセージを表示
    return getLastMessage(applicant);
  };

  // 検索フィルター（確定済みのクエリで検索）
  const filteredApplicants = applicants.filter((applicant) => {
    if (!confirmedQuery) return true;

    const query = confirmedQuery.toLowerCase();
    const officeName = applicant.office_name.toLowerCase();

    // 宛先名で検索
    if (officeName.includes(query)) {
      return true;
    }

    // 全メッセージから検索
    const validMessages: Message[] = applicant.messages.filter(
      (message) => !message.deleted_at
    );

    return validMessages.some((message) =>
      isMessageMatch(message, confirmedQuery)
    );
  });

  // メッセージ詳細ページを表示
  if (selectedApplicant) {
    return (
      <MessageDetail
        applicant={selectedApplicant}
        onBack={handleBackToList}
        onSendMessage={handleSendMessage}
        onRemoveMessage={handleRemoveMessage}
        highlightedMessageId={highlightedMessageId}
      />
    );
  }

  return (
    <div className="max-w-md mx-auto flex flex-col h-screen">
      {/* ヘッダー */}
      <div className="px-6 py-3 border-b border-blue-400">
        <h1 className="text-lg font-bold text-center">すべての宛先</h1>
      </div>

      {/* 検索ボックス */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 text-sm rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="宛先やメッセージを検索..."
            value={searchQuery}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchQuery(newValue);
              // 変換中でなければ即座に検索クエリを更新
              if (!isComposing) {
                setConfirmedQuery(newValue);
              }
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={(e) => {
              setIsComposing(false);
              // 変換確定時に検索クエリを更新
              setConfirmedQuery((e.target as HTMLInputElement).value);
            }}
          />
        </div>
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
          {filteredApplicants.map((applicant) => (
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
                    {renderMatchedMessage(applicant, confirmedQuery)}
                  </p>
                </div>

                {/* 日付・未読バッジ */}
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <span className="text-xs text-gray-500">
                    {formatDateTime(new Date(applicant.last_activity))}
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

      {/* 検索結果なし */}
      {!loading && applicants.length > 0 && filteredApplicants.length === 0 && (
        <div className="text-center py-8 flex-1">
          <p className="text-gray-500">検索結果が見つかりません</p>
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
