export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
// Server components can't resolve a relative URL; inside Docker Compose this
// is typically http://api:8000/api.
const SERVER_BASE = process.env.API_INTERNAL_URL ?? PUBLIC_BASE;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | undefined | null>;

interface ApiOptions extends Omit<RequestInit, "body"> {
  query?: Query;
  json?: unknown;
  body?: BodyInit;
}

export async function apiFetch<T>(path: string, { query, json, headers, ...init }: ApiOptions = {}): Promise<T> {
  const base = typeof window === "undefined" ? SERVER_BASE : PUBLIC_BASE;
  const qs = query
    ? new URLSearchParams(Object.entries(query).filter((e): e is [string, string] => !!e[1])).toString()
    : "";
  const url = `${base}${path}${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    credentials: "same-origin",
    // Cloudflare Access answers unauthenticated admin calls with a redirect to
    // its own login page, not a 401 (TechDoc §8.1). Don't follow it silently.
    redirect: "manual",
    ...init,
    headers: {
      Accept: "application/json",
      ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  if (res.type === "opaqueredirect" || (res.status >= 300 && res.status < 400)) {
    throw new ApiError(401, "Session expired or access denied");
  }
  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, messageFor(res.status, detail), detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function messageFor(status: number, detail: unknown) {
  const d = (detail as { detail?: unknown } | undefined)?.detail;
  if (typeof d === "string") return d;
  switch (status) {
    case 401:
      return "Please sign in again.";
    case 404:
      return "Not found.";
    case 409:
      return "That conflicts with existing data.";
    case 422:
      return "Some fields are invalid.";
    case 429:
      return "Too many requests — please wait a minute and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export const mockDelay = (ms = 350) =>
  typeof window === "undefined" ? Promise.resolve() : new Promise((r) => setTimeout(r, ms));
