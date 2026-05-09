"use client";

import Link from "next/link";
import DefaultImage from "@/shared/component/ui/default_image";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { useWorkList } from "./list_work_logic";

interface ThemeProps {
  isDarkMode: boolean;
}

export function formatDisplayDate(value?: string | Date | null) {
  if (!value) return "Present";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  });
}

export default function ListWorkUI() {
  const { isDarkMode, changeDarkMode } = useGlobalLogic();
  const { works, isLoading, errorMessage } = useWorkList(100);

  const pageClass = isDarkMode
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-950";

  return (
    <div className={pageClass}>
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
          isDarkMode
            ? "border-white/10 bg-slate-950/85"
            : "border-slate-200 bg-white/85"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-base font-black sm:text-xl">
            {"SkyDeveloper"}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                isDarkMode
                  ? "border-white/15 text-slate-200"
                  : "border-slate-300 text-slate-700"
              }`}
            >
              Home
            </Link>
            <button
              type="button"
              onClick={changeDarkMode}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-white"
                  : "border-slate-300 bg-white text-slate-800"
              }`}
            >
              {isDarkMode ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Work
          </h1>
        </div>

        {isLoading && <LoadingRows isDarkMode={isDarkMode} />}
        {!isLoading && errorMessage && (
          <p className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            {errorMessage}
          </p>
        )}

        <div className="mt-10 space-y-5">
          {works.map((item, index) => (
            <WorkCard
              key={item.id ?? `${item.company_name ?? "work"}-${item.job_title ?? index}`}
              item={item}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        <EmptyState
          isVisible={!isLoading && works.length === 0}
          label="No work data yet."
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}

function WorkCard({
  item,
  isDarkMode,
}: ThemeProps & { item: WorkResponse.Data }) {
  return (
    <article
      className={`animate-reveal grid gap-5 rounded-3xl p-6 shadow-sm transition duration-300 hover:-translate-y-1 lg:grid-cols-[180px_1fr] ${
        isDarkMode
          ? "border border-white/10 bg-white/5"
          : "border border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-4 lg:block">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-slate-100 lg:h-20 lg:w-20">
          {item.image_url ? (
            <DefaultImage
              src={item.image_url}
              alt={item.company_name}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-lg font-black text-sky-700">
              {(item.company_name ?? "W").slice(0, 1)}
            </div>
          )}
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700 lg:mt-4">
          {formatDisplayDate(item.start_date)} - {formatDisplayDate(item.end_date)}
        </p>
      </div>
      <div>
        <h3 className="text-2xl font-bold">{item.job_title ?? "Work Role"}</h3>
        <p className="mt-1 text-base font-semibold text-slate-500">
          {item.company_name ?? "Company"}
        </p>
        <p
          className={`mt-4 text-base leading-7 ${
            isDarkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {item.description ?? "No description available."}
        </p>
      </div>
    </article>
  );
}

function LoadingRows({ isDarkMode }: ThemeProps) {
  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className={`h-64 animate-pulse rounded-3xl ${
            isDarkMode ? "bg-white/10" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

function EmptyState({
  isVisible,
  label,
  isDarkMode,
}: ThemeProps & { isVisible: boolean; label: string }) {
  if (!isVisible) return null;
  return (
    <p
      className={`mt-8 rounded-2xl border px-5 py-4 text-sm font-semibold ${
        isDarkMode
          ? "border-white/10 bg-white/5 text-slate-300"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      {label}
    </p>
  );
}