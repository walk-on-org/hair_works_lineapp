"use client";

import { useState } from "react";
import { Applicant, Message } from "@/types/message";
import { ArrowLeftIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface MessageDetailProps {
  applicant: Applicant;
  onBack: () => void;
  onSendMessage: (content: string) => void;
}

export default function MessageDetail({
  applicant,
  onBack,
  onSendMessage,
}: MessageDetailProps) {
  const [messages, setMessages] = useState<Message[]>(applicant.messages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    /*if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: "salon_staff",
        senderName: "サロンスタッフ",
        content: newMessage,
        timestamp: new Date(),
        isFromCurrentUser: true,
      };
      setMessages([...messages, message]);
      setNewMessage("");
      onSendMessage(newMessage);
    }*/
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "今日";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "昨日";
    } else {
      return date.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ヘッダー */}
      <div className="bg-blue-600 text-white p-4 flex items-center space-x-3">
        <button onClick={onBack} className="p-1 hover:bg-blue-700 rounded">
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-lg font-semibold">{applicant.office_name}</h1>
          <p className="text-sm text-blue-200">オンライン</p>
        </div>
      </div>

      {/* メッセージ履歴 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const showDate =
            index === 0 ||
            formatDate(new Date(message.created_at)) !==
              formatDate(new Date(messages[index - 1].created_at));

          return (
            <div key={message.id}>
              {/* 日付セパレーター */}
              {showDate && (
                <div className="text-center my-4">
                  <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDate(new Date(message.created_at))}
                  </span>
                </div>
              )}

              {/* メッセージ */}
              <div
                className={`flex ${
                  message.sender_type === 2 ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_type === 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_type === 2
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(new Date(message.created_at))}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* メッセージ入力エリア */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
