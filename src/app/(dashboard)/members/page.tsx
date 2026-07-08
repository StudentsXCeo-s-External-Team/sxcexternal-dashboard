"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ApiError, Pagination } from "@/lib/api-client";
import { Member } from "@/types";
import DeleteModal from "@/components/DeleteModal";

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<Member[]>(`/members?page=${page}&limit=20`)
      .then(({ data, pagination }) => {
        setMembers(data);
        setPagination(pagination ?? null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/members/${deleteTarget.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete member");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Members</h1>
          <p className="text-sm text-zinc-500">{pagination ? `${pagination.total} members` : ""}</p>
        </div>
        <Link href="/members/new" className="px-4 py-2 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors">
          + Add Member
        </Link>
      </div>

      <div className="bg-white rounded-md border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-zinc-400 text-sm">Loading...</div>
        ) : members.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm">
            No members yet.{" "}
            <Link href="/members/new" className="text-sxc-navy hover:underline">Add one now</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Member</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Role Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Period</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {member.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.photo_url} alt={member.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center shrink-0">
                          <span className="text-xs font-medium text-zinc-500">{member.name[0]}</span>
                        </div>
                      )}
                      <span className="font-medium text-zinc-800">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium ${member.role_type === "executive" ? "bg-sxc-navy text-white" : member.role_type === "management" ? "bg-sxc-blue text-white" : "bg-zinc-100 text-zinc-500"}`} style={{ borderRadius: "3px" }}>
                      {member.role_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{member.position ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">{member.period ?? "—"}</td>
                  <td className="px-4 py-3 text-zinc-500">{member.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/members/${member.id}`} className="text-sxc-navy hover:underline text-xs font-medium">Edit</Link>
                      <button onClick={() => setDeleteTarget(member)} className="text-red-500 hover:underline text-xs font-medium">Delete</button>
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

      <DeleteModal isOpen={!!deleteTarget} itemName={deleteTarget?.name ?? ""} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}

