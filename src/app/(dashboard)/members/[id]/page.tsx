"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import { Member } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import DeleteModal from "@/components/DeleteModal";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function EditMemberPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role_type: "associate" as "executive" | "management" | "associate",
    position: "",
    department: "",
    photo_url: "",
    period: "",
    bio: "",
    social_url: "",
    sort_order: 0,
  });

  useEffect(() => {
    api
      .get<Member>(`/members/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name,
          role_type: data.role_type ?? "associate",
          position: data.position ?? "",
          department: data.department ?? "",
          photo_url: data.photo_url ?? "",
          period: data.period ?? "",
          bio: data.bio ?? "",
          social_url: data.social_url ?? "",
          sort_order: data.sort_order,
        });
      })
      .catch(() => setError("Member not found"))
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
      await api.put(`/members/${id}`, {
        ...form,
        position: form.position || null,
        department: form.department || null,
        photo_url: form.photo_url || null,
        period: form.period || null,
        bio: form.bio || null,
        social_url: form.social_url || null,
      });
      router.push("/members");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/members/${id}`);
      router.push("/members");
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
          <Link href="/members" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Edit Member</h1>
        </div>
        <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div>
          <label className={LABEL}>Name <span className="text-red-500">*</span></label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Role Type <span className="text-red-500">*</span></label>
          <select required value={form.role_type} onChange={(e) => set("role_type", e.target.value)} className={INPUT}>
            <option value="executive">Executive (Board of Executive)</option>
            <option value="management">Management (Board of Management)</option>
            <option value="associate">Associate</option>
          </select>
        </div>

        <div>
          <label className={LABEL}>Position / Role</label>
          <input value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="e.g. Chairman, Secretary" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Department / Division</label>
          <input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="e.g. Data & Technology, Human Resources" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Period / Year</label>
          <input value={form.period} onChange={(e) => set("period", e.target.value)} placeholder="e.g. 2024/2025" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Photo</label>
          <ImageUpload value={form.photo_url} onChange={(url) => set("photo_url", url)} folder="members" />
        </div>

        <div>
          <label className={LABEL}>Bio</label>
          <textarea rows={3} value={form.bio} onChange={(e) => set("bio", e.target.value)} className={`${INPUT} resize-none`} />
        </div>

        <div>
          <label className={LABEL}>Social / LinkedIn URL</label>
          <input type="url" value={form.social_url} onChange={(e) => set("social_url", e.target.value)} placeholder="https://linkedin.com/in/..." className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} className={INPUT} />
          <p className="text-xs text-zinc-400 mt-1">Lower number = appears first</p>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/members" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">Cancel</Link>
        </div>
      </form>

      <DeleteModal isOpen={showDelete} itemName={form.name} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </div>
  );
}
