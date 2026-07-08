"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api-client";
import ImageUpload from "@/components/ImageUpload";

const INPUT =
  "w-full px-3 py-2.5 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-sxc-blue";
const LABEL = "block text-sm font-medium text-zinc-700 mb-1.5";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  function set(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/events", {
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

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/events" className="text-zinc-400 hover:text-zinc-600 transition-colors">
          ← Back
        </Link>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Add Event</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-700 p-6 space-y-5">
        <div>
          <label className={LABEL}>Title <span className="text-red-500">*</span></label>
          <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Event name" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Event description..." className={`${INPUT} resize-none`} />
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
          <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Venue name or online URL" className={INPUT} />
        </div>

        <div>
          <label className={LABEL}>Registration URL</label>
          <input type="url" value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)} placeholder="https://..." className={INPUT} />
          <p className="text-xs text-zinc-400 mt-1">Link for attendees to register (optional)</p>
        </div>

        <div className="flex items-center gap-3">
          <input id="published" type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} className="w-4 h-4 rounded text-sxc-navy" />
          <label htmlFor="published" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Publish immediately</label>
        </div>

        {error && <div className="px-3 py-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="px-5 py-2.5 bg-sxc-navy text-white text-sm font-medium rounded-md hover:bg-sxc-blue transition-colors disabled:opacity-60">
            {loading ? "Saving..." : "Save Event"}
          </button>
          <Link href="/events" className="px-5 py-2.5 text-sm font-medium text-zinc-600 bg-zinc-100 dark:bg-zinc-800 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

