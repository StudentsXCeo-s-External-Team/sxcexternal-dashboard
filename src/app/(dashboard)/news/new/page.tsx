"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";
import { generateSlug } from "@/lib/utils";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

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
    images: [] as string[],
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
        images: form.images,
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
        <Link href="/news" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-zinc-900">Add News</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-zinc-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Article title" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>
            Slug{" "}
            <span className="text-xs text-zinc-400 font-normal">(auto-generated from title)</span>
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
          <label className={LABEL}>
            Gallery Images
            <span className="text-xs text-zinc-400 font-normal ml-2">(shown below article content)</span>
          </label>
          <div className="space-y-3">
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImageUpload
                  value={url}
                  onChange={(newUrl) => {
                    const updated = [...form.images];
                    updated[i] = newUrl;
                    set("images", updated);
                  }}
                  folder="news"
                />
                <button
                  type="button"
                  onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                  className="shrink-0 px-2 py-1 text-xs text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set("images", [...form.images, ""])}
              className="px-3 py-2 text-sm text-sxc-navy border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
            >
              + Add Image
            </button>
          </div>
        </div>

        <div>
          <label className={LABEL}>Author</label>
          <input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Author name" className={INPUT} />
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-sxc-navy" />
          <label htmlFor="published" className="text-sm font-medium text-zinc-700">Publish immediately</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Article"}
          </button>
          <Link href="/news" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

