"use client";

import { useRef } from "react";

type FileUploadFieldProps = {
  label: string;
  value?: string | null;
  accept?: string;
  isUploading?: boolean;
  onUpload: (file: File) => Promise<void>;
};

export default function FileUploadField({
  label,
  value,
  accept = "image/*",
  isUploading = false,
  onUpload,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChoose = () => {
    inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    await onUpload(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Current path
            </p>
            <p className="mt-2 break-all text-sm text-slate-100">{value || "-"}</p>
          </div>
          <button
            type="button"
            onClick={handleChoose}
            disabled={isUploading}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : value ? "Replace file" : "Upload file"}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
