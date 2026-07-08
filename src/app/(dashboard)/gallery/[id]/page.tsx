"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import { GalleryPhoto } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import DeleteModal from "@/components/DeleteModal";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function EditPhotoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    is_published: true,
  });

  useEffect(() => {
    api
      .get<GalleryPhoto>(`/gallery/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          image_url: data.image_url,
          category: data.category ?? "",
          is_published: data.is_published,
        });
      })
      .catch(() => setError("Photo not found"))
      .finally(() => setFetching(false));
  }, [id]);

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.put(`/gallery/${id}`, {
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

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/gallery/${id}`);
      router.push("/gallery");
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
          <Link href="/gallery" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit Photo</h1>
        </div>
        <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div>
          <label className={LABEL}>Photo</label>
          <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} folder="gallery" />
        </div>

        <div>
          <label className={LABEL}>Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Photo title (optional)" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${INPUT} resize-none`} />
        </div>

        <div>
          <label className={LABEL}>Category</label>
          <input value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Events, Members, Campus" className={INPUT} />
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-sxc-navy" />
          <label htmlFor="published" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Published</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/gallery" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Cancel</Link>
        </div>
      </form>

      <DeleteModal isOpen={showDelete} itemName={form.title || "this photo"} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </div>
  );
}
