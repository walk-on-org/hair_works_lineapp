"use client";

import { useState, useEffect } from "react";
import { Applicant, Message } from "@/types/message";
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

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
  const [rows, setRows] = useState(1);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: 0,
        applicant_id: applicant.id,
        sender_type: 2,
        content_type: "text",
        message: newMessage,
        attachment: "",
        already_read: 0,
        created_at: new Date(),
      };
      setMessages([...messages, message]);
      setNewMessage("");
      onSendMessage(newMessage);
    }
  };

  useEffect(() => {
    setRows(newMessage.split("\n").length);
  }, [newMessage]);

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
    <div className="max-w-md mx-auto flex flex-col h-screen">
      {/* ヘッダー */}
      <div className="pt-3 pb-2 px-4 border-b border-blue-400 flex items-center space-x-3 justify-start">
        <button
          onClick={onBack}
          className="p-1 hover:bg-blue-400/20 rounded-full cursor-pointer"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {[
              applicant.job_category_name,
              applicant.position_name,
              applicant.employment_name,
            ].map((item, index) => (
              <span
                key={index}
                className="text-xs bg-black text-white px-2 py-1 rounded font-bold"
              >
                {item}
              </span>
            ))}
          </div>
          <h1 className="font-semibold">{applicant.office_name}</h1>
          <p className="text-xs">
            応募日時：
            {new Date(applicant.created_at).toLocaleString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
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
                className={`flex gap-1 items-end justify-end ${
                  message.sender_type === 1 && "flex-row-reverse"
                }`}
              >
                <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                  <p>
                    {message.sender_type === 1 &&
                      message.already_read === 1 &&
                      "既読"}
                  </p>
                  <p>{formatTime(new Date(message.created_at))}</p>
                </div>

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-gray-900 ${
                    message.sender_type === 1
                      ? "bg-gray-100"
                      : "bg-green-400/50"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* メッセージ入力エリア */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2 items-end">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={rows}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white p-2 aspect-square rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
