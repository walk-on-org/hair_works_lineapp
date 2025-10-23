"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Applicant, Message } from "@/types/message";
import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
  DocumentIcon,
  PhotoIcon,
  ArrowTopRightOnSquareIcon,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Image from "next/image";

interface MessageDetailProps {
  applicant: Applicant;
  onBack: () => void;
  onSendMessage: (
    applicantId: number,
    message: string,
    attachment: File | null,
    contentType: string
  ) => Promise<Message[]>;
  onRemoveMessage: (
    applicantId: number,
    messageId: number
  ) => Promise<Message[]>;
  highlightedMessageId?: number | null;
  isListEntering?: boolean;
}

export default function MessageDetail({
  applicant,
  onBack,
  onSendMessage,
  onRemoveMessage,
  highlightedMessageId,
  isListEntering = false,
}: MessageDetailProps) {
  const [messages, setMessages] = useState<Message[]>(applicant.messages);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [rows, setRows] = useState(1);
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const highlightedMessageRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [selectAttachment, setSelectAttachment] = useState<boolean>(false);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false); // 送信中か
  const [isRemovingMessage, setIsRemovingMessage] = useState<boolean>(false); // 削除中か
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);
  const [totalImagesCount, setTotalImagesCount] = useState(0);

  // メッセージ送信
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      setIsSendingMessage(true);
      const newMessages = await onSendMessage(
        applicant.id,
        inputMessage,
        null,
        "text"
      );
      setMessages(newMessages);
      scrollToBottom();
      setInputMessage("");
      setIsSendingMessage(false);
    }
  };

  // メッセージ削除
  const handleRemoveMessage = async (messageId: number) => {
    setIsRemovingMessage(true);
    const newMessages = await onRemoveMessage(applicant.id, messageId);
    setMessages(newMessages);
    setSelectedMessage(null);
    setIsRemovingMessage(false);
  };

  // メッセージ長押し
  const handleTouchStart = (message: Message) => {
    // 自分のメッセージ以外は長押しを検知しない
    if (message.sender_type === 1) {
      return;
    }

    // 長押しを検知（1000ms）
    timerRef.current = setTimeout(() => {
      setSelectedMessage(message); // メニューを表示する
    }, 1000);
  };
  const handleTouchEnd = () => {
    // 長押し解除（タップなど）
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // メッセージ入力エリアの行数を設定
  useEffect(() => {
    setRows(inputMessage.split("\n").length);
  }, [inputMessage]);

  // 画像読み込み完了時のコールバック
  const handleImageLoad = useCallback(() => {
    setLoadedImagesCount((prev) => prev + 1);
  }, []);

  // メッセージ履歴の最後までスクロール
  const scrollToBottom = useCallback(() => {
    const performScroll = () => {
      if (messagesRef.current) {
        messagesRef.current.scrollTo({
          top: messagesRef.current.scrollHeight,
        });
      }
    };

    // 画像がある場合、全ての画像が読み込まれるまで待つ
    if (totalImagesCount > 0) {
      const checkImagesLoaded = () => {
        if (loadedImagesCount >= totalImagesCount) {
          // 全ての画像が読み込まれた後、即座にスクロール
          performScroll();
        } else {
          // まだ読み込まれていない画像がある場合は再試行
          setTimeout(checkImagesLoaded, 200);
        }
      };
      checkImagesLoaded();
    } else {
      // 画像がない場合は即座にスクロール
      performScroll();
    }
  }, [totalImagesCount, loadedImagesCount]);

  // ハイライトされたメッセージまでスクロール
  const scrollToHighlightedMessage = () => {
    if (highlightedMessageRef.current) {
      highlightedMessageRef.current.scrollIntoView({
        block: "start",
      });
    }
  };

  // 画像の総数を計算
  useEffect(() => {
    const imageCount = messages.filter(
      (message) => !message.deleted_at && message.content_type === "image"
    ).length;
    setTotalImagesCount(imageCount);
    // メッセージが更新されたら画像読み込みカウンターをリセット
    setLoadedImagesCount(0);
  }, [messages]);

  // メッセージが更新された時は最下部にスクロール
  useEffect(() => {
    if (highlightedMessageId) {
      scrollToHighlightedMessage();
    } else {
      scrollToBottom();
    }
  }, [messages, highlightedMessageId, scrollToBottom]);

  // 全ての画像が読み込まれた時にスクロール実行
  useEffect(() => {
    if (
      totalImagesCount > 0 &&
      loadedImagesCount >= totalImagesCount &&
      !highlightedMessageId
    ) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [
    loadedImagesCount,
    totalImagesCount,
    highlightedMessageId,
    scrollToBottom,
  ]);

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

  // ファイルメッセージ送信
  const handleSendFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    contentType: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error(
        "ファイルの上限サイズ3MBを超えているため、送信できません。上限サイズを超えている場合はメールで送信してください。",
        {
          style: {
            border: "1px solid #ff0000",
            padding: "12px 16px",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "bold",
          },
        }
      );
      return;
    }

    setIsSendingMessage(true);
    const newMessages = await onSendMessage(
      applicant.id,
      "",
      file,
      contentType
    );
    setMessages(newMessages);
    scrollToBottom();
    setSelectAttachment(false);
    setIsSendingMessage(false);
    imageFileRef.current!.value = "";
    fileRef.current!.value = "";
  };

  return (
    <div
      className={`w-full mx-auto flex flex-col h-full transition-all duration-300  ${
        isListEntering && "animate-slide-out-right"
      }`}
    >
      {/* ヘッダー */}
      <div className="py-3 px-4 border-b border-blue-green flex items-center space-x-3 justify-start">
        <button
          onClick={onBack}
          className="p-1 hover:bg-blue-400/20 rounded-full cursor-pointer"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex gap-1">
            {[
              applicant.job_category_name,
              applicant.position_name,
              applicant.employment_name,
            ].map((item, index) => (
              <span
                key={index}
                className="text-xs bg-black text-white px-1.5 py-0.5 rounded font-bold"
              >
                {item}
              </span>
            ))}
          </div>
          <h1 className="font-bold">{applicant.office_name}</h1>
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
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/detail/${applicant.job_id}`}
          className="p-1 cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ArrowTopRightOnSquareIcon className="w-6 h-6" />
        </a>
      </div>

      {/* メッセージ履歴 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesRef}>
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
                ref={
                  message.id === highlightedMessageId
                    ? highlightedMessageRef
                    : null
                }
              >
                <div className="flex flex-col gap-0.5 text-xs text-gray-500">
                  <p>
                    {message.sender_type === 2 &&
                      message.already_read === 1 &&
                      !message.deleted_at &&
                      "既読"}
                  </p>
                  <p>{formatTime(new Date(message.created_at))}</p>
                </div>

                {message.deleted_at && (
                  <div className="max-w-xs lg:max-w-md px-2 py-1 rounded-full text-gray-900 bg-gray-200">
                    <p className="text-xs whitespace-pre-wrap">
                      メッセージが削除されました
                    </p>
                  </div>
                )}
                {!message.deleted_at && message.content_type === "text" && (
                  <>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-gray-900 ${
                        message.sender_type === 1
                          ? "bg-gray-100"
                          : "bg-green-400/50"
                      }`}
                      onTouchStart={() => handleTouchStart(message)}
                      onTouchEnd={handleTouchEnd}
                      onMouseDown={() => handleTouchStart(message)} // PC対応
                      onMouseUp={handleTouchEnd}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </>
                )}
                {!message.deleted_at && message.content_type === "image" && (
                  <div
                    className="max-w-xs lg:max-w-md"
                    onTouchStart={() => handleTouchStart(message)}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={() => handleTouchStart(message)} // PC対応
                    onMouseUp={handleTouchEnd}
                  >
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_API_BASE_URL +
                        message.attachment
                      }
                      width={300}
                      height={300}
                      alt="添付ファイル"
                      className="w-full h-full object-cover rounded-lg"
                      onLoad={handleImageLoad}
                      onError={() => {
                        // エラーでもカウントする
                        handleImageLoad();
                      }}
                    />
                  </div>
                )}
                {!message.deleted_at && message.content_type === "file" && (
                  <a
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-gray-900 flex items-center gap-2 ${
                      message.sender_type === 1
                        ? "bg-gray-100"
                        : "bg-green-400/50"
                    }`}
                    onTouchStart={() => handleTouchStart(message)}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={() => handleTouchStart(message)} // PC対応
                    onMouseUp={handleTouchEnd}
                    href={
                      process.env.NEXT_PUBLIC_API_BASE_URL + message.attachment
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DocumentIcon className="w-5 h-5" />
                    <p className="text-xs whitespace-pre-wrap font-bold">
                      {message.attachment.split("/").pop()}
                    </p>
                  </a>
                )}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <div className="text-gray-500 h-[calc(100%-32px)] flex items-center justify-center">
            <p className="text-sm">メッセージがありません</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* メッセージ入力エリア */}
      <div className="border-t border-gray-200 px-3 py-2">
        <div className="flex space-x-2 items-end">
          {/* 添付ファイル */}
          <button
            className="px-2 py-2.5 aspect-square"
            onClick={() => setSelectAttachment(!selectAttachment)}
          >
            <PaperClipIcon className="w-5 h-5 text-blue-green stroke-2" />
          </button>
          {/* 画像ファイル選択 */}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={imageFileRef}
            onChange={(e) => handleSendFileUpload(e, "image")}
          />
          {/* 書類ファイル選択 */}
          <input
            type="file"
            className="hidden"
            accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf"
            ref={fileRef}
            onChange={(e) => handleSendFileUpload(e, "file")}
          />
          {/* メッセージ */}
          <textarea
            value={inputMessage}
            onFocus={() => setSelectAttachment(false)}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-green"
            rows={rows}
            maxLength={500}
          />
          {/* 送信ボタン */}
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isSendingMessage}
            className="bg-blue-green text-white px-2 py-2.5 aspect-square rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSendingMessage ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            ) : (
              <PaperAirplaneIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* 添付ファイル選択ポップアップ */}
      {selectAttachment && (
        <div
          className="absolute top-0 left-0 w-full h-full bg-black/50"
          onClick={() => setSelectAttachment(false)}
        >
          <div className="bg-white p-6 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 border-t-6 border-blue-green">
            <h3 className="font-bold mb-6 text-center">添付ファイルを選択</h3>
            <div className="flex flex-col gap-2 items-center">
              <button
                className="flex justify-center items-center gap-2 px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full bg-blue-green text-white"
                onClick={() => {
                  imageFileRef.current?.click();
                }}
              >
                <PhotoIcon className="w-8 h-8" />
                <span className="font-bold text-sm">画像</span>
              </button>
              <button
                className="flex justify-center items-center gap-2 px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full bg-blue-green text-white"
                onClick={() => {
                  fileRef.current?.click();
                }}
              >
                <DocumentIcon className="w-8 h-8" />
                <span className="font-bold text-sm">ファイル</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メッセージ削除メニュー */}
      {selectedMessage && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/50">
          <div className="bg-white p-4 rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80">
            <p className="text-sm">
              削除するとメッセージは復元できません。
              <br />
              削除しますか？
            </p>
            <div className="flex gap-2 mt-4 justify-around">
              <button
                disabled={isRemovingMessage}
                className="bg-blue-green text-white p-2 rounded-lg cursor-pointer w-28 font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={() => handleRemoveMessage(selectedMessage.id)}
              >
                {isRemovingMessage ? "削除中..." : "削除"}
              </button>
              <button
                className="border border-gray-600 bg-white text-gray-600 p-2 rounded-lg cursor-pointer w-28"
                onClick={() => setSelectedMessage(null)}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
