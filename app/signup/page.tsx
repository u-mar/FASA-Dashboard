// filepath: app/signup/page.tsx
// ...existing code...
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function validEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validEmail(email)) return setError("Enter a valid email");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 201) {
        setSuccess("Account created — redirecting to login...");
        setTimeout(() => router.push("/login"), 1200);
        return;
      }

      const payload = await res.json().catch(() => ({}));
      setError(payload?.message || "Signup failed");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Create your account" footerText="Already have an account?" footerLinkText="Sign in" footerHref="/login">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-gray-600">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="you@example.com"
            aria-label="email"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600">Password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            className="mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Create a password"
            aria-label="password"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600">Confirm password</span>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            className="mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            placeholder="Confirm password"
            aria-label="confirm-password"
          />
        </label>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-emerald-600">{success}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </div>
      </form>
    </AuthCard>
  );
}