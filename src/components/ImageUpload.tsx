"use client";

import { useRef, useState } from "react";
import { api, ApiError } from "@/lib/api-client";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "cms",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const { data } = await api.upload(file, folder);
      onChange(data.url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-md p-5 text-center transition-colors ${
          uploading
            ? "border-zinc-200 cursor-not-allowed"
            : "border-zinc-200 hover:border-sxc-blue cursor-pointer"
        }`}
      >
        {value ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="max-h-40 mx-auto rounded-md object-cover"
            />
            <p className="text-xs text-zinc-400">
              {uploading ? "Uploading..." : "Click to replace image"}
            </p>
          </div>
        ) : (
          <div className="py-4">
            <svg
              className="w-10 h-10 text-zinc-300 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-zinc-500">
              {uploading ? "Uploading..." : "Click to upload image"}
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              JPEG, PNG, WebP, GIF — max 5MB
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

