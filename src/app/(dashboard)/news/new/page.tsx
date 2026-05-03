"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";
import { generateSlug } from "@/lib/utils";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

export default function NewNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    author: "",
    slug: "",
    is_published: true,
  });

  useEffect(() => {
    if (!slugTouched) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  }, [form.title, slugTouched]);

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/news", {
        ...form,
        image_url: form.image_url || null,
        author: form.author || null,
      });
      router.push("/news");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/news" className="text-slate-400 hover:text-slate-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-slate-900">Add News</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Article title" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>
            Slug{" "}
            <span className="text-xs text-slate-400 font-normal">(auto-generated from title)</span>
          </label>
          <input
            required
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }}
            placeholder="article-slug"
            className={INPUT}
          />
        </div>

        <div>
          <label className={LABEL}>Content <span className="text-red-500">*</span></label>
          <textarea required rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Article content..." className={`${INPUT} resize-y`} />
        </div>

        <div>
          <label className={LABEL}>Cover Image</label>
          <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} folder="news" />
        </div>

        <div>
          <label className={LABEL}>Author</label>
          <input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" className={INPUT} />
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
          <label htmlFor="published" className="text-sm font-medium text-slate-700">Publish immediately</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Article"}
          </button>
          <Link href="/news" className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
