"use client";

import Link from "next/link";
import { useState } from "react";
import DefaultImage from "@/shared/component/ui/default_image";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { usePortofolioList } from "./list_portofolio_logic";

interface ThemeProps {
  isDarkMode: boolean;
}

export default function ListPortofolioUI() {
  const { isDarkMode, changeDarkMode } = useGlobalLogic();
  const { 
    portofolios, 
    works,
    isLoading, 
    errorMessage,
    filters,
    applyFilters,
    clearFilters
  } = usePortofolioList(100);
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [workFilter, setWorkFilter] = useState(filters.work_id || "");

  const pageClass = isDarkMode
    ? "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#111827_100%)] text-slate-100"
    : "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,208,255,0.12),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_52%,_#ffffff_100%)] text-slate-900";

  const inputClass = isDarkMode
    ? "w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
    : "w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-sky-400/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20";

  const selectClass = isDarkMode
    ? "w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 transition-all focus:border-cyan-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
    : "w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm text-slate-900 transition-all focus:border-sky-400/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20";

  const handleSearch = () => {
    applyFilters({
      search: searchInput || undefined,
      work_id: workFilter || undefined,
    });
  };

  const handleClear = () => {
    setSearchInput("");
    setWorkFilter("");
    clearFilters();
  };

  const hasActiveFilters = filters.search || filters.work_id;

  return (
    <div className={pageClass}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`animate-float-slow absolute top-0 left-0 h-96 w-96 rounded-full blur-3xl ${
            isDarkMode ? "bg-cyan-400/8" : "bg-cyan-300/15"
          }`}
        />
        <div
          className={`animate-float-delayed absolute top-64 right-0 h-64 w-64 rounded-full blur-3xl ${
            isDarkMode ? "bg-blue-400/8" : "bg-blue-300/12"
          }`}
        />
      </div>

      <header
        className={`animate-slide-down sticky top-0 z-40 border-b backdrop-blur-xl ${
          isDarkMode
            ? "border-white/10 bg-slate-950/75"
            : "border-white/60 bg-white/70"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-base font-black tracking-tight sm:text-xl">
            {"<SkyDeveloper />"}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`hidden rounded-full border px-4 py-2 text-sm font-semibold transition sm:inline-block ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-slate-200 hover:border-cyan-300 hover:text-cyan-200"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:border-sky-300 hover:text-sky-700"
              }`}
            >
              Home
            </Link>
            <button
              type="button"
              onClick={changeDarkMode}
              aria-label="Toggle dark mode"
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-white hover:border-cyan-300 hover:text-cyan-200"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:border-sky-300 hover:text-sky-700"
              }`}
            >
              {isDarkMode ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-3xl">
          <span
            className={`inline-flex rounded-full border px-4 py-1 text-xs font-semibold tracking-wide ${
              isDarkMode
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
                : "border-sky-200 bg-sky-100 text-sky-700"
            }`}
          >
            Portfolio Collection
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Portofolio
          </h1>
          <p className={`mt-4 max-w-xl text-sm sm:text-base ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Explore my body of work. Use the filters below to find specific projects by search term or associated work experience.
          </p>
        </div>

        <div className={`animate-reveal mt-8 rounded-3xl border p-5 shadow-lg backdrop-blur-sm transition-all sm:p-6 ${
          isDarkMode
            ? "border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(15,23,42,0.3)]"
            : "border-white/60 bg-white/60 shadow-[0_20px_60px_rgba(148,163,184,0.12)]"
        }`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Search
              </label>
              <div className="relative">
                <svg
                  className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className={`${inputClass} pl-11`}
                />
              </div>
            </div>
            <div className="w-full sm:w-64">
              <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                Filter by Work
              </label>
              <div className="relative">
                <select
                  value={workFilter}
                  onChange={(e) => setWorkFilter(e.target.value)}
                  className={`${selectClass} appearance-none pr-10`}
                >
                  <option value="">All Works</option>
                  {works.map((work) => (
                    <option key={work.id} value={work.id || ""}>
                      {work.company_name || work.job_title || "Unknown"}
                    </option>
                  ))}
                </select>
                <svg
                  className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="flex gap-2 pt-4 lg:pt-0 lg:items-end">
              <button
                onClick={handleSearch}
                className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                    : "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500"
                }`}
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              <button
                onClick={handleClear}
                className={`rounded-2xl border px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                  isDarkMode
                    ? "border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400/50 hover:text-cyan-200"
                    : "border-slate-200 bg-white/80 text-slate-700 hover:border-sky-400/50 hover:text-sky-700"
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="animate-reveal mt-5 flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Active filters:
            </span>
            {filters.search && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${
                  isDarkMode
                    ? "bg-cyan-900/30 text-cyan-200 border border-cyan-400/20"
                    : "bg-sky-100 text-sky-700 border border-sky-200"
                }`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {filters.search}
                <button
                  onClick={() => applyFilters({ ...filters, search: undefined })}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/10"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {filters.work_id && (
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium ${
                  isDarkMode
                    ? "bg-blue-900/30 text-blue-200 border border-blue-400/20"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {works.find((w) => w.id === filters.work_id)?.company_name || filters.work_id}
                <button
                  onClick={() => applyFilters({ ...filters, work_id: undefined })}
                  className="ml-1 rounded-full p-0.5 hover:bg-white/10"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        )}

        {isLoading && <LoadingRows isDarkMode={isDarkMode} />}
        {!isLoading && errorMessage && (
          <div className="animate-reveal mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && portofolios.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portofolios.map((item, index) => (
              <PortofolioCard key={item.id ?? item.title ?? index} item={item} index={index} isDarkMode={isDarkMode} />
            ))}
          </div>
        )}

        <EmptyState
          isVisible={!isLoading && !errorMessage && portofolios.length === 0}
          label="No portofolio data found."
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}

function PortofolioCard({
  item,
  index = 0,
  isDarkMode,
}: {
  item: PortofolioResponse.Data;
  index?: number;
  isDarkMode: boolean;
}) {
  const frameworks = item.framework_mappings
    ?.map((mapping) => mapping.framework?.title)
    .filter(Boolean)
    .slice(0, 3);
  const content = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
        {item.thumbnail_url ? (
          <DefaultImage
            src={item.thumbnail_url}
            alt={item.title}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-slate-400">
            {item.title ?? "Portofolio"}
          </div>
        )}
        <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${isDarkMode ? 'bg-cyan-400/10' : 'bg-sky-400/10'}`} />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
          {item.work?.company_name ?? "Selected Work"}
        </p>
        <h3 className="mt-3 text-xl font-bold">{item.title ?? "Untitled"}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-slate-300">
          {item.description ?? "No description available."}
        </p>
        {!!frameworks?.length && (
          <div className="mt-5 flex flex-wrap gap-2">
            {frameworks.map((framework) => (
              <span
                key={framework}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200"
              >
                {framework}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (item.id) {
    return (
      <Link
        href={`/portofolio/${item.id}`}
        className="animate-reveal group overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_25px_70px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(15,23,42,0.35)]"
        style={{ animationDelay: `${0.1 + index * 0.08}s` }}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      className="animate-reveal group overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_25px_70px_rgba(15,23,42,0.2)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(15,23,42,0.35)]"
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
    >
      {content}
    </article>
  );
}

function LoadingRows({ isDarkMode }: ThemeProps) {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className={`h-72 animate-pulse rounded-3xl ${
            isDarkMode ? "bg-white/5" : "bg-slate-200/80"
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
    <div className="animate-reveal mt-16 flex flex-col items-center justify-center gap-4 rounded-3xl border p-12 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
        isDarkMode ? "bg-white/5" : "bg-slate-100"
      }`}>
        <svg className={`h-8 w-8 ${isDarkMode ? "text-slate-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <p className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
        {label}
      </p>
    </div>
  );
}