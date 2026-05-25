"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api, getAuthToken, setAuthToken } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<{ data?: User } & User>("/user");
      setUser("data" in data && data.data ? data.data : (data as User));
    } catch {
      setAuthToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ user: User; token: string }>("/login", {
      email,
      password,
    });
    setAuthToken(data.token);
    setUser(data.user);
    router.push("/jobs");
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) => {
    const { data } = await api.post<{ user: User; token: string }>(
      "/register",
      payload
    );
    setAuthToken(data.token);
    setUser(data.user);
    router.push("/jobs");
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      /* ignore */
    }
    setAuthToken(null);
    setUser(null);
    router.push("/login");
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
