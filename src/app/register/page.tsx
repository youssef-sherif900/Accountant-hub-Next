"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AxiosError } from "axios";

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
    setErrors({});
    setSubmitting(true);
    try {
      await register(form);
    } catch (err) {
      const axiosErr = err as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      if (axiosErr.response?.data?.errors) {
        const mapped: Record<string, string> = {};
        Object.entries(axiosErr.response.data.errors).forEach(([k, v]) => {
          mapped[k] = v[0];
        });
        setErrors(mapped);
      } else {
        setErrors({ email: axiosErr.response?.data?.message ?? "Registration failed." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="auth-card card">
        <h1>Create account</h1>
        <p>Join Accountant Hub and start bidding on jobs.</p>
        <form onSubmit={handleSubmit}>
          {(["name", "email", "phone", "password", "password_confirmation"] as const).map(
            (field) => (
              <div className="form-group" key={field}>
                <label htmlFor={field}>
                  {field === "password_confirmation"
                    ? "Confirm password"
                    : field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ")}
                </label>
                <input
                  id={field}
                  type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                  required={field !== "phone"}
                  value={form[field]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                />
                {errors[field] && <span className="form-error">{errors[field]}</span>}
              </div>
            )
          )}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
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
          max-width: 460px;
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
      `}</style>
    </div>
  );
}
