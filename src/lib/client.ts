

type ApiError = Error & { status?: number; body?: unknown };


const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ||
  "/api"
).replace(/\/+$/, "");

function buildUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("admin_token");
  } catch {
    return null;
  }
}

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    return await res.text();
  } catch {
    return null;
  }
}

async function req<T>(method: string, url: string, body?: unknown): Promise<T> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;


  const headers: Record<string, string> = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(buildUrl(url), {
    method,
    credentials: "include",
    headers,
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
  });

  if (res.status === 204) return undefined as T;

  const data = await parseResponse(res);

  if (!res.ok) {
    // Auto redirect to /login on 401
    if (typeof window !== "undefined" && res.status === 401) {
      try {
        localStorage.removeItem("admin_token");
      } catch { }
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    const message =
      (data &&
        typeof data === "object" &&
        "error" in (data as any) &&
        (data as any).error) ||
      (typeof data === "string" && data) ||
      res.statusText;

    const err: ApiError = new Error(String(message || "Request failed"));
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data as T;
}

const client = {
  get: <T = any>(url: string) => req<T>("GET", url),
  post: <T = any>(url: string, body?: unknown) => req<T>("POST", url, body),
  patch: <T = any>(url: string, body?: unknown) => req<T>("PATCH", url, body),
  put: <T = any>(url: string, body?: unknown) => req<T>("PUT", url, body),
  del: <T = any>(url: string) => req<T>("DELETE", url),
};

export default client;
