"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError, Pagination } from "@/lib/api-client";
import { GalleryPhoto } from "@/types";
import DeleteModal from "@/components/DeleteModal";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<GalleryPhoto | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<GalleryPhoto[]>(`/gallery?page=${page}&limit=20`)
      .then(({ data, pagination }) => {
        setPhotos(data);
        setPagination(pagination ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/gallery/${deleteTarget.id}`);
      setPhotos((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete photo");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Gallery</h1>
          <p className="text-sm text-zinc-500">{pagination ? `${pagination.total} photos` : ""}</p>
        </div>
        <Link href="/gallery/new" className="px-4 py-2 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors">
          + Add Photo
        </Link>
      </div>

      {loading ? (
        <div className="py-16 text-center text-zinc-400 text-sm">Loading...</div>
      ) : photos.length === 0 ? (
        <div className="py-16 text-center text-zinc-400 text-sm">
          No photos yet.{" "}
          <Link href="/gallery/new" className="text-sxc-navy hover:underline">Add one now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative bg-white rounded-md border border-zinc-200 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image_url} alt={photo.title ?? ""} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-sm font-medium text-zinc-800 truncate">{photo.title ?? "Untitled"}</p>
                {photo.category && <p className="text-xs text-zinc-400 mt-0.5">{photo.category}</p>}
                <span className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${photo.is_published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                  {photo.is_published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link href={`/gallery/${photo.id}`} className="px-2 py-1 bg-white text-xs font-medium text-sxc-navy rounded-md shadow hover:bg-zinc-50">Edit</Link>
                <button onClick={() => setDeleteTarget(photo)} className="px-2 py-1 bg-white text-xs font-medium text-red-500 rounded-md shadow hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-zinc-200 rounded-md disabled:opacity-40 hover:bg-zinc-50 transition-colors">← Prev</button>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-zinc-200 rounded-md disabled:opacity-40 hover:bg-zinc-50 transition-colors">Next →</button>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.title ?? "this photo"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

