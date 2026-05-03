"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

export default function NewMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    position: "",
    photo_url: "",
    period: "",
    bio: "",
    sort_order: 0,
  });

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/members", {
        ...form,
        position: form.position || null,
        photo_url: form.photo_url || null,
        period: form.period || null,
        bio: form.bio || null,
      });
      router.push("/members");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/members" className="text-slate-400 hover:text-slate-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-slate-900">Add Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Name <span className="text-red-500">*</span></label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Position / Role</label>
          <input value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="e.g. Chairman, Secretary" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Period / Year</label>
          <input value={form.period} onChange={(e) => set("period", e.target.value)} placeholder="e.g. 2024/2025" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Photo</label>
          <ImageUpload value={form.photo_url} onChange={(url) => set("photo_url", url)} folder="members" />
        </div>

        <div>
          <label className={LABEL}>Bio</label>
          <textarea rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Short bio..." className={`${INPUT} resize-none`} />
        </div>

        <div>
          <label className={LABEL}>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} placeholder="0" className={INPUT} />
          <p className="text-xs text-slate-400 mt-1">Lower number = appears first</p>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Member"}
          </button>
          <Link href="/members" className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
