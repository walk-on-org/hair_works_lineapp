import { Applicant, ApplicantMessageResponse } from "@/types/message";

// APIのベースURL（環境変数から取得）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// API呼び出し用のヘルパー関数
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// LIFFトークンを使用したAPI呼び出し
export async function fetchApplicantMessageList(
  accessToken: string
): Promise<Applicant[]> {
  try {
    const result = await apiCall<ApplicantMessageResponse>(
      "/api/v1/applicants/messages",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return result.data.applicants;
  } catch (error) {
    console.error("認証付きメッセージ一覧の取得に失敗しました:", error);
    throw error;
  }
}

/*// 特定の会話のメッセージ履歴取得API
export async function fetchMessageHistory(
  recipientId: string
): Promise<ChatMessage[]> {
  try {
    return await apiCall<ChatMessage[]>(`/messages/${recipientId}/history`);
  } catch (error) {
    console.error("メッセージ履歴の取得に失敗しました:", error);
    throw error;
  }
}

// メッセージ送信API
export async function sendMessage(
  recipientId: string,
  content: string
): Promise<ChatMessage> {
  try {
    return await apiCall<ChatMessage>(`/messages/${recipientId}`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  } catch (error) {
    console.error("メッセージの送信に失敗しました:", error);
    throw error;
  }
}

// 未読メッセージ数取得API
export async function fetchUnreadCount(): Promise<number> {
  try {
    const result = await apiCall<{ count: number }>("/messages/unread-count");
    return result.count;
  } catch (error) {
    console.error("未読メッセージ数の取得に失敗しました:", error);
    throw error;
  }
}
*/
