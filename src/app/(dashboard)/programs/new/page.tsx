"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";
import { generateSlug } from "@/lib/utils";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function NewProgramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [highlightInput, setHighlightInput] = useState("");

  const [form, setForm] = useState({
    badge: "",
    slug: "",
    category: "",
    title: "",
    month: "",
    audience: "",
    cover: "",
    hero: "",
    images: [] as string[],
    excerpt: "",
    content: "",
    highlights: [] as string[],
    is_published: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (!slugTouched) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.badge) }));
    }
  }, [form.badge, slugTouched]);

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addHighlight() {
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    set("highlights", [...form.highlights, trimmed]);
    setHighlightInput("");
  }

  function removeHighlight(i: number) {
    set("highlights", form.highlights.filter((_, j) => j !== i));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/programs", form);
      router.push("/programs");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/programs" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Add Program</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Badge Name <span className="text-red-500">*</span></label>
            <input required value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="e.g. School of Ideas" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Slug <span className="text-xs text-zinc-400 font-normal">(auto)</span></label>
            <input required value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} placeholder="school-of-ideas" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Full program title" className={INPUT} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Category <span className="text-red-500">*</span></label>
            <input required value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. HIGH SCHOOL PROGRAM" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Month / Date <span className="text-red-500">*</span></label>
            <input required value={form.month} onChange={(e) => set("month", e.target.value)} placeholder="e.g. April 24, 2025" className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Audience <span className="text-red-500">*</span></label>
          <input required value={form.audience} onChange={(e) => set("audience", e.target.value)} placeholder="e.g. High School Students" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Cover Image <span className="text-red-500">*</span></label>
          <ImageUpload value={form.cover} onChange={(url) => set("cover", url)} folder="programs" />
        </div>

        <div>
          <label className={LABEL}>Hero Image <span className="text-red-500">*</span></label>
          <ImageUpload value={form.hero} onChange={(url) => set("hero", url)} folder="programs" />
        </div>

        <div>
          <label className={LABEL}>Excerpt <span className="text-red-500">*</span></label>
          <textarea required rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short summary shown on cards..." className={`${INPUT} resize-y`} />
        </div>

        <div>
          <label className={LABEL}>Content <span className="text-red-500">*</span></label>
          <textarea required rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="Full program description. Separate paragraphs with a blank line." className={`${INPUT} resize-y`} />
        </div>

        <div>
          <label className={LABEL}>Highlights <span className="text-xs text-zinc-400 font-normal">(What You&apos;ll Get bullet points)</span></label>
          <div className="space-y-2">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-700 dark:text-zinc-300">{h}</span>
                <button type="button" onClick={() => removeHighlight(i)} className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">Remove</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="Add a highlight..." className={`flex-1 ${INPUT}`} />
              <button type="button" onClick={addHighlight} className="px-3 py-2 text-sm text-sxc-navy border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">+ Add</button>
            </div>
          </div>
        </div>

        <div>
          <label className={LABEL}>Gallery Images <span className="text-xs text-zinc-400 font-normal">(optional)</span></label>
          <div className="space-y-3">
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImageUpload value={url} onChange={(newUrl) => { const updated = [...form.images]; updated[i] = newUrl; set("images", updated); }} folder="programs" />
                <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="shrink-0 px-2 py-1 text-xs text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => set("images", [...form.images, ""])} className="px-3 py-2 text-sm text-sxc-navy border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">+ Add Image</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} className={INPUT} />
            <p className="text-xs text-zinc-400 mt-1">Lower number = shown first</p>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-sxc-navy" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Publish immediately</span>
            </label>
          </div>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Program"}
          </button>
          <Link href="/programs" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

