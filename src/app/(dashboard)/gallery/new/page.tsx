"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function NewPhotoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    is_published: true,
  });

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!form.image_url) { setError("Please upload an image first"); return; }
    setError("");
    setLoading(true);

    try {
      await api.post("/gallery", {
        ...form,
        title: form.title || null,
        description: form.description || null,
        category: form.category || null,
      });
      router.push("/gallery");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/gallery" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-zinc-900">Add Photo</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-zinc-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Photo <span className="text-red-500">*</span></label>
          <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} folder="gallery" />
        </div>

        <div>
          <label className={LABEL}>Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Photo title (optional)" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Photo description..." className={`${INPUT} resize-none`} />
        </div>

        <div>
          <label className={LABEL}>Category</label>
          <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Events, Members, Campus" className={INPUT} />
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-sxc-navy" />
          <label htmlFor="published" className="text-sm font-medium text-zinc-700">Publish immediately</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Photo"}
          </button>
          <Link href="/gallery" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

