"use client";

import { useRef } from "react";

type FileUploadFieldProps = {
  label: string;
  value?: string | null;
  accept?: string;
  multiple?: boolean;
  isUploading?: boolean;
  onUpload: (file: File) => Promise<void>;
  onUploadMany?: (files: File[]) => Promise<void>;
  currentLabel?: string;
  uploadLabel?: string;
  replaceLabel?: string;
};

export default function FileUploadField({
  label,
  value,
  accept = "image/*",
  multiple = false,
  isUploading = false,
  onUpload,
  onUploadMany,
  currentLabel = "Selected file",
  uploadLabel = "Choose file",
  replaceLabel = "Change file",
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChoose = () => {
    inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    if (multiple && onUploadMany) {
      await onUploadMany(files);
      return;
    }
    for (const file of files) {
      await onUpload(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-200">{label}</span>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {currentLabel}
            </p>
            <p className="mt-2 break-all text-sm text-slate-100">{value || "-"}</p>
          </div>
          <button
            type="button"
            onClick={handleChoose}
            disabled={isUploading}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading..." : value ? replaceLabel : uploadLabel}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
