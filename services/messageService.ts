import {
  Applicant,
  ApplicantMessageResponse,
  LoginResponse,
  SendMessageResponse,
} from "@/types/message";

// APIのベースURL
// クライアントサイドからはNext.jsのリライト機能を使用してCORSを回避
const API_BASE_URL =
  typeof window !== "undefined"
    ? "" // クライアントサイド：相対パスでNext.jsのリライトを利用
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"; // サーバーサイド：直接APIを呼び出す

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

// ログインAPI（初回、メールアドレスとパスワードでログイン）
export async function loginByEmail(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const result = await apiCall<LoginResponse>(
      "/api/v1/auth/login_line_app_email",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    return result;
  } catch (error) {
    console.error("ログインに失敗しました:", error);
    throw error;
  }
}

// ログインAPI（2回目以降、トークンなし）
export async function loginByUserId(
  lineUserId: string
): Promise<LoginResponse> {
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
          attachment: "",
          contenttype: "text",
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

// ファイルメッセージ送信API
export async function sendFileMessage(
  applicantId: number,
  attachment: File,
  contentType: string,
  accessToken: string
): Promise<Applicant[]> {
  try {
    const formData = new FormData();
    formData.append("applicantid", applicantId.toString());
    formData.append("message", "");
    formData.append("attachment", attachment);
    formData.append("contenttype", contentType);

    // FormDataを使用する場合はapiCallを使わず直接fetchを呼び出す
    // （Content-Typeはブラウザが自動的にboundaryを含めて設定する必要があるため）
    const url = `${API_BASE_URL}/api/v1/applicants/messages/send`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Content-Typeは設定しない（ブラウザが自動的に設定）
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result: SendMessageResponse = await response.json();
    return result.data.applicants;
  } catch (error) {
    console.error("ファイルの送信に失敗しました:", error);
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
