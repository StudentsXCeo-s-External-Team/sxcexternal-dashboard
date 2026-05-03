// Client-side fetch wrapper — calls Next.js API routes (same origin, no CORS)

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface RawResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

export interface ApiResult<T> {
  data: T;
  pagination?: Pagination;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  const isFormData = options?.body instanceof FormData;

  const res = await fetch(`/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...options?.headers,
    },
  });

  const json: RawResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ApiError(json.error ?? "Request failed", res.status);
  }

  return { data: json.data!, pagination: json.pagination };
}

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),

  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  upload: (file: File, folder = "cms") => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folder);
    return request<{ url: string }>("/upload", { method: "POST", body: form });
  },
};
