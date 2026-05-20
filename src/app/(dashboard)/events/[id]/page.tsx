"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import { Event } from "@/types";
import ImageUpload from "@/components/ImageUpload";
import DeleteModal from "@/components/DeleteModal";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
const LABEL = "block text-sm font-medium text-slate-700 mb-1.5";

function toLocal(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 16);
}

export default function EditEventPage() {
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
    start_date: "",
    end_date: "",
    location: "",
    registration_url: "",
    is_published: true,
  });

  useEffect(() => {
    api
      .get<Event>(`/events/${id}`)
      .then(({ data }) => {
        setForm({
          title: data.title,
          description: data.description ?? "",
          image_url: data.image_url ?? "",
          start_date: toLocal(data.start_date),
          end_date: toLocal(data.end_date),
          location: data.location ?? "",
          registration_url: data.registration_url ?? "",
          is_published: data.is_published,
        });
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load event"))
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
      await api.put(`/events/${id}`, {
        ...form,
        description: form.description || null,
        image_url: form.image_url || null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        location: form.location || null,
        registration_url: form.registration_url || null,
        start_date: new Date(form.start_date).toISOString(),
      });
      router.push("/events");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.delete(`/events/${id}`);
      router.push("/events");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete");
      setDeleting(false);
    }
  }

  if (fetching) {
    return <div className="flex items-center justify-center py-20 text-slate-400 text-sm">Loading...</div>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/events" className="text-slate-400 hover:text-slate-600 transition-colors">← Back</Link>
          <h1 className="text-xl font-bold text-slate-900">Edit Event</h1>
        </div>
        <button onClick={() => setShowDelete(true)} className="px-3 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          Delete
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <div>
          <label className={LABEL}>Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={`${INPUT} resize-none`} />
        </div>

        <div>
          <label className={LABEL}>Image</label>
          <ImageUpload value={form.image_url} onChange={(url) => set("image_url", url)} folder="events" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Start Date <span className="text-red-500">*</span></label>
            <input required type="datetime-local" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>End Date</label>
            <input type="datetime-local" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className={INPUT} />
          </div>
        </div>

        <div>
          <label className={LABEL}>Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Registration URL</label>
          <input type="url" value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)} placeholder="https://..." className={INPUT} />
          <p className="text-xs text-slate-400 mt-1">Link for attendees to register (optional)</p>
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-indigo-600" />
          <label htmlFor="published" className="text-sm font-medium text-slate-700">Published</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link href="/events" className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </Link>
        </div>
      </form>

      <DeleteModal isOpen={showDelete} itemName={form.title} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} loading={deleting} />
    </div>
  );
}
