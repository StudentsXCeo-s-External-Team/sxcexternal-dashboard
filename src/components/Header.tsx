"use client";

interface HeaderProps {
  adminName: string | null;
  adminEmail: string;
}

export default function Header({ adminName, adminEmail }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-zinc-100 flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-zinc-800">{adminName ?? adminEmail}</p>
          <p className="text-[11px] text-zinc-400 tracking-wide">{adminEmail}</p>
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: "#07224F" }}>
          {(adminName ?? adminEmail).charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
