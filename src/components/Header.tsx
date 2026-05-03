"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  adminName: string | null;
  adminEmail: string;
}

export default function Header({ adminName, adminEmail }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">
            {adminName ?? adminEmail}
          </p>
          <p className="text-xs text-slate-400">{adminEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-slate-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
