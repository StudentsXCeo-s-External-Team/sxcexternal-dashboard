"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const errorParam = searchParams.get("error");

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError("Gagal login dengan Google. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-950">

      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sxc-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-sxc-skyblue" />
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{ background: "var(--color-sxc-skyblue)" }} />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: "var(--color-sxc-blue)" }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-sxc-skyblue" />
            <span className="text-sxc-skyblue text-xs font-bold tracking-[0.2em] uppercase">
              StudentsxCEOs Jakarta
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10">
          <h1 className="text-5xl xl:text-6xl font-black text-white uppercase leading-[0.9] tracking-tight mb-6">
            Content<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #00ADF1" }}>
              Management
            </span><br />
            System
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-sm border-l border-sxc-skyblue pl-4">
            Kelola konten website StudentsxCEOs Jakarta — berita, events, program, galeri, dan lebih banyak lagi.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-zinc-600 text-xs tracking-widest uppercase">Batch 14 · Internal Tool</p>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 dark:bg-zinc-950">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-10 flex items-center gap-3">
            <div className="h-px w-8 bg-sxc-blue" />
            <span className="text-sxc-navy text-xs font-bold tracking-[0.2em] uppercase">
              StudentsxCEOs Jakarta
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-sxc-navy dark:text-white uppercase tracking-tight leading-none mb-2">
              Admin Login
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Masuk dengan akun Google yang terdaftar sebagai admin.
            </p>
          </div>

          <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800 mb-8" />

          {(error || errorParam) && (
            <div className="mb-6 px-4 py-3 border-l-2 border-red-500 bg-red-50">
              <p className="text-sm text-red-600 font-medium">
                {error || (errorParam === "unauthorized"
                  ? "Akun ini tidak memiliki akses admin."
                  : "Terjadi kesalahan. Coba lagi.")}
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-5 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-sxc-blue transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: "4px" }}
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {loading ? "Mengarahkan..." : "Masuk dengan Google"}
          </button>

          <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
            Hanya email admin yang terdaftar yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>

    </div>
  );
}
