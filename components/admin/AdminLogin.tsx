"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiJson } from "@/components/admin/cloud";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password.trim()) {
      setError("Enter the admin password.");
      return;
    }
    setBusy(true);
    try {
      await apiJson("/api/admin/login", "POST", { password });
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
      setBusy(false);
    }
  };

  return (
    <div className="container-lux flex min-h-screen items-center justify-center py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-card border border-border bg-[#0b0b12] p-8 shadow-lux"
      >
        <p className="label-eyebrow text-gold">Faizal Jewellery</p>
        <h1 className="mt-2 font-display text-3xl text-ivory">Admin sign in</h1>
        <p className="mt-2 text-sm text-ivory/60">
          Enter the password to manage collection photos.
        </p>

        <label className="mt-6 block text-sm text-ivory/80" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-black/40 px-4 py-3 text-ivory outline-none focus:border-gold"
          disabled={busy}
        />

        {error ? <p className="mt-3 text-sm text-[#ff9b9b]">{error}</p> : null}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 w-full rounded-full bg-gold px-6 py-3 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
