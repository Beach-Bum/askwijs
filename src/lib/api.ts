import { supabase } from "./supabase";

const BASE_URL = "/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new ApiError(res.status, body);
  }
  return res.json();
}

export const api = {
  async get<T = unknown>(path: string): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${path}`, { headers });
    return handleResponse<T>(res);
  },

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },
};

export { ApiError };
