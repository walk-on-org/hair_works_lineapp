import {
  Applicant,
  ApplicantMessageResponse,
  LoginResponse,
  SendMessageResponse,
} from "@/types/message";

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

// ログインAPI（初回トークンあり）
export async function loginVerifyToken(
  token: string,
  lineUserId: string
): Promise<LoginResponse> {
  try {
    const result = await apiCall<LoginResponse>(
      "/api/v1/auth/login_line_app_verify_token",
      {
        method: "POST",
        body: JSON.stringify({ token, line_user_id: lineUserId }),
      }
    );
    return result;
  } catch (error) {
    console.error("ログインに失敗しました:", error);
    throw error;
  }
}

// ログインAPI（2回目以降、トークンなし）
export async function login(lineUserId: string): Promise<LoginResponse> {
  try {
    const result = await apiCall<LoginResponse>(
      "/api/v1/auth/login_line_app_user_id",
      {
        method: "POST",
        body: JSON.stringify({ line_user_id: lineUserId }),
      }
    );
    return result;
  } catch (error) {
    console.error("ログインに失敗しました:", error);
    throw error;
  }
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

// メッセージ送信API
export async function sendMessage(
  applicantId: number,
  message: string,
  attachment: File | null,
  contentType: string,
  accessToken: string
): Promise<Applicant[]> {
  try {
    const result = await apiCall<SendMessageResponse>(
      `/api/v1/applicants/messages/send`,
      {
        method: "POST",
        body: JSON.stringify({
          applicantid: applicantId,
          message: message,
          attachment: attachment,
          contenttype: contentType,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return result.data.applicants;
  } catch (error) {
    console.error("メッセージの送信に失敗しました:", error);
    throw error;
  }
}

// メッセージ削除API
export async function removeMessage(
  applicantId: number,
  messageId: number,
  accessToken: string
): Promise<Applicant[]> {
  try {
    const result = await apiCall<SendMessageResponse>(
      `/api/v1/applicants/messages/delete`,
      {
        method: "POST",
        body: JSON.stringify({
          applicantid: applicantId,
          messageid: messageId,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return result.data.applicants;
  } catch (error) {
    console.error("メッセージの削除に失敗しました:", error);
    throw error;
  }
}

// メッセージ既読API
export async function alreadyReadMessage(
  applicantId: number,
  accessToken: string
): Promise<Applicant[]> {
  try {
    const result = await apiCall<SendMessageResponse>(
      `/api/v1/applicants/messages/already`,
      {
        method: "POST",
        body: JSON.stringify({ applicantid: applicantId }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return result.data.applicants;
  } catch (error) {
    console.error("メッセージの既読に失敗しました:", error);
    throw error;
  }
}
