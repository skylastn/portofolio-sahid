"use client";

import Link from "next/link";
import { useState, type Dispatch, type SetStateAction } from "react";
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
    categories,
    frameworks,
    codeLanguages,
    isLoading, 
    errorMessage,
    filters,
    applyFilters,
    clearFilters
  } = usePortofolioList(100);
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [workFilter, setWorkFilter] = useState<string[]>(filters.work_ids ?? []);
  const [categoryFilter, setCategoryFilter] = useState<string[]>(filters.category_ids ?? []);
  const [frameworkFilter, setFrameworkFilter] = useState<string[]>(filters.framework_ids ?? []);
  const [codeLanguageFilter, setCodeLanguageFilter] = useState<string[]>(filters.code_language_ids ?? []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const pageClass = isDarkMode
    ? "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.08),_transparent_32%),linear-gradient(180deg,_#020617_0%,_#0f172a_52%,_#111827_100%)] text-slate-100"
    : "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,208,255,0.12),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_52%,_#ffffff_100%)] text-slate-900";

  const inputClass = isDarkMode
    ? "w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-cyan-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
    : "w-full rounded-2xl border border-slate-200 bg-white/80 px-5 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-sky-400/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400/20";

  const handleSearch = () => {
    applyFilters({
      search: searchInput || undefined,
      work_ids: workFilter,
      category_ids: categoryFilter,
      framework_ids: frameworkFilter,
      code_language_ids: codeLanguageFilter,
    });
    setIsFilterOpen(false);
  };

  const openFilterDialog = () => {
    setSearchInput(filters.search || "");
    setWorkFilter(filters.work_ids ?? []);
    setCategoryFilter(filters.category_ids ?? []);
    setFrameworkFilter(filters.framework_ids ?? []);
    setCodeLanguageFilter(filters.code_language_ids ?? []);
    setIsFilterOpen(true);
  };

  const handleClear = () => {
    setSearchInput("");
    setWorkFilter([]);
    setCategoryFilter([]);
    setFrameworkFilter([]);
    setCodeLanguageFilter([]);
    clearFilters();
  };

  const hasActiveFilters =
    filters.search ||
    !!filters.work_ids?.length ||
    !!filters.category_ids?.length ||
    !!filters.framework_ids?.length ||
    !!filters.code_language_ids?.length;
  const toggleSelection = (
    value: string,
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const filterOptions = [
    {
      label: "Work",
      values: workFilter,
      onToggle: (value: string) => toggleSelection(value, setWorkFilter),
      options: works.map((work) => ({
        id: work.id ?? "",
        label: work.company_name || work.job_title || "Unknown",
      })),
    },
    {
      label: "Category",
      values: categoryFilter,
      onToggle: (value: string) => toggleSelection(value, setCategoryFilter),
      options: categories.map((category) => ({
        id: category.id ?? "",
        label: category.title || "Untitled",
      })),
    },
    {
      label: "Framework",
      values: frameworkFilter,
      onToggle: (value: string) => toggleSelection(value, setFrameworkFilter),
      options: frameworks.map((framework) => ({
        id: framework.id ?? "",
        label: framework.title || "Untitled",
      })),
    },
    {
      label: "Code Language",
      values: codeLanguageFilter,
      onToggle: (value: string) => toggleSelection(value, setCodeLanguageFilter),
      options: codeLanguages.map((codeLanguage) => ({
        id: codeLanguage.id ?? "",
        label: codeLanguage.title || "Untitled",
      })),
    },
  ];
  const activeFilterChips = [
    filters.search && {
      key: "search",
      label: filters.search,
      onClear: () => {
        setSearchInput("");
        applyFilters({ ...filters, search: undefined });
      },
    },
    ...(filters.work_ids ?? []).map((id) => ({
      key: `work-${id}`,
      label:
        works.find((work) => work.id === id)?.company_name ||
        works.find((work) => work.id === id)?.job_title ||
        id,
      onClear: () => {
        const next = workFilter.filter((item) => item !== id);
        setWorkFilter(next);
        applyFilters({ ...filters, work_ids: next });
      },
    })),
    ...(filters.category_ids ?? []).map((id) => ({
      key: `category-${id}`,
      label: categories.find((category) => category.id === id)?.title || id,
      onClear: () => {
        const next = categoryFilter.filter((item) => item !== id);
        setCategoryFilter(next);
        applyFilters({ ...filters, category_ids: next });
      },
    })),
    ...(filters.framework_ids ?? []).map((id) => ({
      key: `framework-${id}`,
      label: frameworks.find((framework) => framework.id === id)?.title || id,
      onClear: () => {
        const next = frameworkFilter.filter((item) => item !== id);
        setFrameworkFilter(next);
        applyFilters({ ...filters, framework_ids: next });
      },
    })),
    ...(filters.code_language_ids ?? []).map((id) => ({
      key: `code-language-${id}`,
      label:
        codeLanguages.find((language) => language.id === id)?.title || id,
      onClear: () => {
        const next = codeLanguageFilter.filter((item) => item !== id);
        setCodeLanguageFilter(next);
        applyFilters({ ...filters, code_language_ids: next });
      },
    })),
  ].filter(Boolean) as {
    key: string;
    label: string;
    onClear: () => void;
  }[];

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
            {"SkyDeveloper"}
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
          {/* <p className={`mt-4 max-w-xl text-sm sm:text-base ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Explore my body of work. Filter by work, category, framework, or code language.
          </p> */}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openFilterDialog}
            className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
              isDarkMode
                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/15"
                : "border-sky-200 bg-white text-sky-700 hover:border-sky-300"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" />
            </svg>
            Filter
            {activeFilterChips.length > 0 && (
              <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs text-white">
                {activeFilterChips.length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-slate-200 hover:border-cyan-400/50"
                  : "border-slate-200 bg-white/80 text-slate-700 hover:border-sky-300"
              }`}
            >
              Clear all
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="animate-reveal mt-5 flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
              Active filters:
            </span>
            {activeFilterChips.map((chip) => (
              <ActiveFilterChip
                key={chip.key}
                label={chip.label}
                isDarkMode={isDarkMode}
                onClear={chip.onClear}
              />
            ))}
          </div>
        )}

        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-8 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Close filter"
              className="absolute inset-0 cursor-default"
              onClick={() => setIsFilterOpen(false)}
            />
            <div
              className={`relative w-full max-w-4xl rounded-3xl border p-5 shadow-2xl sm:p-6 ${
                isDarkMode
                  ? "border-white/10 bg-slate-950 text-slate-100"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Filter portfolio
                  </p>
                  <h2 className="mt-2 text-2xl font-black">Find projects</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                    isDarkMode
                      ? "border-white/15 bg-white/5 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                  aria-label="Close filter"
                >
                  x
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Search
                  </label>
                  <div className="relative">
                    <svg
                      className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
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

                <div className="grid gap-4 lg:grid-cols-2">
                  {filterOptions.map((filter) => (
                    <MultiFilterGroup
                      key={filter.label}
                      label={filter.label}
                      values={filter.values}
                      options={filter.options}
                      isDarkMode={isDarkMode}
                      onToggle={filter.onToggle}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClear}
                    className={`rounded-2xl border px-6 py-3 text-sm font-semibold transition ${
                      isDarkMode
                        ? "border-white/15 bg-white/5 text-slate-200"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                  >
                    Apply filter
                  </button>
                </div>
              </div>
            </div>
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

function MultiFilterGroup({
  label,
  values,
  options,
  isDarkMode,
  onToggle,
}: {
  label: string;
  values: string[];
  options: { id: string; label: string }[];
  isDarkMode: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <div
        className={`mb-2 block text-xs font-semibold uppercase tracking-wider ${
          isDarkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
        {values.length > 0 && (
          <span className="ml-2 rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] text-sky-300">
            {values.length}
          </span>
        )}
      </div>
      <div
        className={`flex max-h-40 flex-wrap gap-2 overflow-auto rounded-2xl border p-3 ${
          isDarkMode
            ? "border-white/10 bg-white/5"
            : "border-slate-200 bg-white/80"
        }`}
      >
        {options.length === 0 ? (
          <p
            className={`px-2 py-1 text-xs ${
              isDarkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            No options
          </p>
        ) : (
          options.map((option) => {
            const checked = values.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onToggle(option.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  checked
                    ? isDarkMode
                      ? "border-cyan-300/40 bg-cyan-400/15 text-cyan-100"
                      : "border-sky-300 bg-sky-100 text-sky-800"
                    : isDarkMode
                      ? "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/30 hover:text-cyan-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    checked ? "bg-cyan-300" : "bg-slate-400/50"
                  }`}
                />
                {option.label}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
function ActiveFilterChip({
  label,
  isDarkMode,
  onClear,
}: {
  label: string;
  isDarkMode: boolean;
  onClear: () => void;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium ${
        isDarkMode
          ? "border-cyan-400/20 bg-cyan-900/30 text-cyan-200"
          : "border-sky-200 bg-sky-100 text-sky-700"
      }`}
    >
      {label}
      <button
        type="button"
        onClick={onClear}
        className="rounded-full p-0.5 hover:bg-white/10"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
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
