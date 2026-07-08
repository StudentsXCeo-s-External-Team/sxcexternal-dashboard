"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

export default function NewPartnerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    partner_type: "corporate" as "corporate" | "media" | "community",
    website_url: "",
    sort_order: 0,
    is_published: true,
  });

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/partners", {
        ...form,
        website_url: form.website_url || null,
      });
      router.push("/partners");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/partners" className="text-slate-400 hover:text-slate-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-slate-900">Add Partner</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Name <span className="text-red-500">*</span></label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Mondelez" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Type <span className="text-red-500">*</span></label>
          <select required value={form.partner_type} onChange={(e) => set("partner_type", e.target.value)} className={INPUT}>
            <option value="corporate">Corporate Partner</option>
            <option value="media">Media Partner</option>
            <option value="community">Community Partner</option>
          </select>
        </div>

        <div>
          <label className={LABEL}>Logo <span className="text-red-500">*</span></label>
          <ImageUpload value={form.logo_url} onChange={(url) => set("logo_url", url)} folder="partners" />
        </div>

        <div>
          <label className={LABEL}>Website URL</label>
          <input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://..." className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} className={INPUT} />
          <p className="text-xs text-slate-400 mt-1">Lower number = shown first</p>
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
          <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Partner"}
          </button>
          <Link href="/partners" className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
