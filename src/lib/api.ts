import axios from "axios";

const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const API_PORT = process.env.NEXT_PUBLIC_API_PORT ?? "8000";

/**
 * Use the same host as the page (e.g. 192.168.1.6) so API works over LAN,
 * not localhost (which would point at the phone/laptop viewing the site).
 */
export function resolveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return DEFAULT_API_URL;
  }

  const { protocol, hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return DEFAULT_API_URL;
  }

  return `${protocol}//${hostname}:${API_PORT}/api`;
}

export const api = axios.create({
  baseURL: DEFAULT_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.baseURL = resolveApiBaseUrl();

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}
