"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return (
      <div className="container auth-page">
        <p>
          You are already logged in. <Link href="/jobs">Browse jobs</Link>
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>;
      setError(
        axiosErr.response?.data?.errors?.email?.[0] ??
          axiosErr.response?.data?.message ??
          "Login failed."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card card">
        <h1>Welcome back</h1>
        <p>Sign in to submit bids and track your proposals.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
        <p className="demo-hint">
          Demo: sarah@accountanthub.test / password123
        </p>
      </div>
      <style jsx>{`
        .auth-page {
          display: flex;
          justify-content: center;
          padding: var(--space-lg) 0 var(--space-2xl);
        }
        .auth-card {
          width: 100%;
          max-width: 420px;
          padding: var(--space-lg);
        }
        @media (min-width: 480px) {
          .auth-page {
            padding: var(--space-2xl) 0;
          }
          .auth-card {
            padding: var(--space-xl);
          }
        }
        .auth-card p {
          color: var(--color-gray-500);
        }
        .auth-card .btn {
          width: 100%;
        }
        .auth-footer {
          margin-top: var(--space-lg);
          text-align: center;
          font-size: 0.9rem;
        }
        .demo-hint {
          font-size: 0.8rem;
          text-align: center;
          margin-top: var(--space-md);
          color: var(--color-gray-500);
        }
      `}</style>
    </div>
  );
}
