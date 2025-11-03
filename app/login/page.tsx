// filepath: [page.tsx](http://_vscodecontentref_/0)
// ...existing code...
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validEmail(e: string) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validEmail(email)) return setError("Enter a valid email");
    if (!password || password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload?.message || "Login failed");
        setLoading(false);
        return;
      }

      // on success navigate to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Welcome back" footerText="Don't have an account?" footerLinkText="Sign up" footerHref="/signup">
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
            placeholder="Your password"
            aria-label="password"
          />
        </label>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <a href="/forgot" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </a>
        </div>
      </form>
    </AuthCard>
  );
}