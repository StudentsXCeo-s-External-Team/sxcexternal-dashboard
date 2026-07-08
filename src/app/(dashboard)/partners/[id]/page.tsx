"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import { Partner } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import DeleteModal from "@/components/DeleteModal";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function EditPartnerPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    logo_url: "",
    partner_type: "corporate" as "corporate" | "media" | "community",
    website_url: "",
    sort_order: 0,
    is_published: true,
  });

  useEffect(() => {
    api
      .get<Partner>(`/partners/${id}`)
      .then(({ data }) => {
        setForm({
          name: data.name,
          logo_url: data.logo_url,
          partner_type: data.partner_type,
          website_url: data.website_url ?? "",
          sort_order: data.sort_order,
          is_published: data.is_published,
        });
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load"))
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
      await api.put(`/partners/${id}`, {
        ...form,
        website_url: form.website_url || null,
      });
      router.push("/partners");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/partners/${id}`);
      router.push("/partners");
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
          <Link href="/partners" className="text-zinc-400 hover:text-zinc-600 transition-colors">← Back</Link>
          <h1 className="text-xl font-bold text-zinc-900">Edit Partner</h1>
        </div>
        <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md border border-zinc-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Name <span className="text-red-500">*</span></label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Type <span className="text-red-500">*</span></label>
          <select required value={form.partner_type} onChange={(e) => set("partner_type", e.target.value)} className={INPUT}>
            <option value="corporate">Corporate Partner</option>
            <option value="media">Media Partner</option>
            <option value="community">Community Partner</option>
          </select>
        </div>

        <div>
          <label className={LABEL}>Logo <span className="text-red-500">*</span></label>
          <ImageUpload value={form.logo_url} onChange={(url) => set("logo_url", url)} folder="partners" />
        </div>

        <div>
          <label className={LABEL}>Website URL</label>
          <input type="url" value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="https://..." className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Sort Order</label>
          <input type="number" value={form.sort_order} onChange={(e) => set("sort_order", parseInt(e.target.value) || 0)} className={INPUT} />
          <p className="text-xs text-zinc-400 mt-1">Lower number = shown first</p>
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-sxc-navy" />
          <label htmlFor="published" className="text-sm font-medium text-zinc-700">Published</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/partners" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 rounded-md hover:bg-zinc-200 transition-colors">Cancel</Link>
        </div>
      </form>

      <DeleteModal isOpen={showDelete} itemName={form.name} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </div>
  );
}
