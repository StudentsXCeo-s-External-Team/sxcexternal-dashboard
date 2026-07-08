"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import { Resource } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import DeleteModal from "@/components/DeleteModal";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function EditResourcePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
    excerpt: "",
    content: "",
    highlights: [] as string[],
    is_published: true,
    sort_order: 0,
  });

  useEffect(() => {
    api
      .get<Resource>(`/resources/${id}`)
      .then(({ data }) => {
        setForm({
          badge: data.badge,
          slug: data.slug,
          category: data.category,
          title: data.title,
          month: data.month,
          audience: data.audience,
          cover: data.cover,
          hero: data.hero,
          excerpt: data.excerpt,
          content: data.content,
          highlights: data.highlights ?? [],
          is_published: data.is_published,
          sort_order: data.sort_order ?? 0,
        });
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load"))
      .finally(() => setFetching(false));
  }, [id]);

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addHighlight() {
    const trimmed = highlightInput.trim();
    if (!trimmed) return;
    set("highlights", [...form.highlights, trimmed]);
    setHighlightInput("");
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.put(`/resources/${id}`, form);
      router.push("/resources");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/resources/${id}`);
      router.push("/resources");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  if (fetching) {
    return <div className="flex items-center justify-center py-20 text-zinc-400 text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/resources" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
          <h1 className="text-xl font-bold text-zinc-900">Edit Resource</h1>
        </div>
        <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">Delete</button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-zinc-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Badge Name <span className="text-red-500">*</span></label>
            <input required value={form.badge} onChange={(e) => set("badge", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Slug</label>
            <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={INPUT} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Category <span className="text-red-500">*</span></label>
            <input required value={form.category} onChange={(e) => set("category", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Update Schedule</label>
            <input required value={form.month} onChange={(e) => set("month", e.target.value)} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Audience</label>
          <input required value={form.audience} onChange={(e) => set("audience", e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Cover Image</label>
          <ImageUpload value={form.cover} onChange={(url) => set("cover", url)} folder="resources" />
        </div>

        <div>
          <label className={LABEL}>Hero Image</label>
          <ImageUpload value={form.hero} onChange={(url) => set("hero", url)} folder="resources" />
        </div>

        <div>
          <label className={LABEL}>Excerpt</label>
          <textarea required rows={3} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={`${INPUT} resize-y`} />
        </div>

        <div>
          <label className={LABEL}>Content</label>
          <textarea required rows={10} value={form.content} onChange={(e) => set("content", e.target.value)} className={`${INPUT} resize-y`} />
        </div>

        <div>
          <label className={LABEL}>Highlights</label>
          <div className="space-y-2">
            {form.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-md text-zinc-700">{h}</span>
                <button type="button" onClick={() => set("highlights", form.highlights.filter((_, j) => j !== i))} className="px-2 py-1 text-xs text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">Remove</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addHighlight(); } }} placeholder="Add a highlight..." className={`flex-1 ${INPUT}`} />
              <button type="button" onClick={addHighlight} className="px-3 py-2 text-sm text-sxc-navy border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors">+ Add</button>
            </div>
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
              <span className="text-sm font-medium text-zinc-700">Published</span>
            </label>
          </div>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/resources" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors">Cancel</Link>
        </div>
      </form>

      <DeleteModal isOpen={showDelete} itemName={form.badge} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </div>
  );
}
