"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError, Pagination } from "@/lib/api-client";
import { Resource } from "@/types";
import DeleteModal from "@/components/DeleteModal";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<Resource[]>(`/resources?page=${page}&limit=10&search=${encodeURIComponent(query)}`)
      .then(({ data, pagination }) => {
        setResources(data);
        setPagination(pagination ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, query]);

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    setPage(1);
    setQuery(search);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/resources/${deleteTarget.id}`);
      setResources((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete resource");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Resources</h1>
          <p className="text-sm text-zinc-500">{pagination ? `${pagination.total} resources found` : ""}</p>
        </div>
        <Link href="/resources/new" className="px-4 py-2 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors">
          + Add Resource
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue" />
        <button type="submit" className="px-4 py-2 bg-zinc-800 text-white text-sm rounded-md hover:bg-zinc-700 transition-colors">Search</button>
      </form>

      <div className="bg-white rounded-md border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-zinc-400 text-sm">Loading...</div>
        ) : resources.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm">
            No resources yet.{" "}
            <Link href="/resources/new" className="text-sxc-navy hover:underline">Add one now</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Resource</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium text-zinc-800 truncate">{resource.badge}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{resource.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{resource.category}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${resource.is_published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {resource.is_published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/resources/${resource.id}`} className="text-sxc-navy hover:underline text-xs font-medium">Edit</Link>
                      <button onClick={() => setDeleteTarget(resource)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Page {pagination.page} of {pagination.totalPages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 border border-zinc-200 rounded-md disabled:opacity-40 hover:bg-zinc-50 transition-colors">← Prev</button>
            <button disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 border border-zinc-200 rounded-md disabled:opacity-40 hover:bg-zinc-50 transition-colors">Next →</button>
          </div>
        </div>
      )}

      <DeleteModal isOpen={!!deleteTarget} itemName={deleteTarget?.badge ?? ""} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}

