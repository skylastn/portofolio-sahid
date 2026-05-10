"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DefaultImage from "@/shared/component/ui/default_image";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { EitherType } from "@/shared/utils/utility/either";
import {
  usePortofolioDetail,
  formatDisplayDate,
} from "./portofolio_detail_logic";

export default function PortofolioDetailUI() {
  const router = useRouter();
  const { isDarkMode, changeDarkMode } = useGlobalLogic();
  const { item, isLoading, errorMessage, fetchDetail } = usePortofolioDetail();
  const id = typeof router.query.id === "string" ? router.query.id : undefined;

  useEffect(() => {
    if (!router.isReady || !id) return;
    void fetchDetail(id);
  }, [id, router.isReady, fetchDetail]);

  const pageClass = isDarkMode
    ? "min-h-screen bg-[linear-gradient(180deg,#020617_0%,#0f172a_48%,#111827_100%)] text-slate-100"
    : "min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_44%,#ffffff_100%)] text-slate-950";
  const surfaceClass = isDarkMode
    ? "border-white/10 bg-white/5 text-slate-200"
    : "border-slate-200 bg-white text-slate-700";
  const mutedClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const titleClass = isDarkMode ? "text-white" : "text-slate-950";
  const categories = item?.category_mappings ?? [];
  const frameworks = item?.framework_mappings ?? [];
  const codeLanguages = getFrameworkCodeLanguageLabels(frameworks);
  const sources = item?.apps_sources ?? [];
  const gallery = item?.images ?? [];

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
              href="/portofolio"
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                isDarkMode
                  ? "border-white/15 text-slate-200"
                  : "border-slate-300 text-slate-700"
              }`}
            >
              Portofolio
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

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        {isLoading && <DetailSkeleton isDarkMode={isDarkMode} />}

        {!isLoading && errorMessage && (
          <div className={`rounded-3xl border px-6 py-8 ${surfaceClass}`}>
            <p className="text-sm font-semibold text-rose-500">
              {errorMessage}
            </p>
            <Link
              href="/portofolio"
              className="mt-5 inline-flex rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to portofolio
            </Link>
          </div>
        )}

        {!isLoading && item && (
          <>
            <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
                <div className="relative aspect-[16/11]">
                  {item.thumbnail_url ? (
                    <DefaultImage
                      src={item.thumbnail_url}
                      alt={item.title}
                      style={{ objectFit: "cover" }}
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-8 text-center text-lg font-bold text-slate-400">
                      {item.title ?? "Portofolio detail"}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Project Detail
                </p>
                <h1
                  className={`mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl ${titleClass}`}
                >
                  {item.title ?? "Untitled Portofolio"}
                </h1>
                <p
                  className={`mt-5 text-base leading-8 sm:text-lg ${mutedClass}`}
                >
                  {item.description ?? "No description available."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {sources.map((source) => (
                    <a
                      key={source.id ?? source.url}
                      href={source.url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-sky-500"
                    >
                      {source.type ? `Open ${source.type}` : "Open source"}
                    </a>
                  ))}
                  <Link
                    href="/portofolio"
                    className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-1 ${
                      isDarkMode
                        ? "border-white/15 bg-white/5 text-white"
                        : "border-slate-300 bg-white text-slate-800"
                    }`}
                  >
                    Back to list
                  </Link>
                </div>
              </div>
            </section>

            <section className="mt-12 grid gap-5 md:grid-cols-3">
              <InfoBlock
                label="Company"
                value={item.work?.company_name ?? "Independent"}
                isDarkMode={isDarkMode}
              />
              <InfoBlock
                label="Role"
                value={item.work?.job_title ?? "Project"}
                isDarkMode={isDarkMode}
              />
              <InfoBlock
                label="Timeline"
                value={`${formatDisplayDate(item.work?.start_date)} - ${formatDisplayDate(item.work?.end_date)}`}
                isDarkMode={isDarkMode}
              />
            </section>

            <section className="mt-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div className={`rounded-3xl border p-6 ${surfaceClass}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Stack and Type
                </p>
                <TagGroup
                  title="Categories"
                  values={categories.map(
                    (mapping) => mapping.category?.title ?? mapping.category_id,
                  )}
                  emptyLabel="No categories."
                  isDarkMode={isDarkMode}
                />
                <TagGroup
                  title="Frameworks"
                  values={frameworks.map(
                    (mapping) =>
                      mapping.framework?.title ?? mapping.framework_id,
                  )}
                  emptyLabel="No frameworks."
                  isDarkMode={isDarkMode}
                />
                <TagGroup
                  title="Code Languages"
                  values={codeLanguages}
                  emptyLabel="No code languages."
                  isDarkMode={isDarkMode}
                />
              </div>

              <div className={`rounded-3xl border p-6 ${surfaceClass}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  Work Context
                </p>
                <h2 className={`mt-3 text-2xl font-bold ${titleClass}`}>
                  {item.work?.job_title ??
                    item.work?.company_name ??
                    "Project background"}
                </h2>
                <p className={`mt-4 text-base leading-7 ${mutedClass}`}>
                  {item.work?.description ??
                    "This project is part of the selected public portfolio collection."}
                </p>
                {item.work?.company_url && (
                  <a
                    href={item.work.company_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex rounded-full border border-sky-300 px-5 py-2.5 text-sm font-semibold text-sky-700"
                  >
                    Visit company
                  </a>
                )}
              </div>
            </section>

            <section className="mt-12">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  {/* <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                    Gallery
                  </p> */}
                  <h2 className={`mt-3 text-3xl font-black ${titleClass}`}>
                    Gallery
                    {/* Screens and supporting images */}
                  </h2>
                </div>
              </div>

              {gallery.length > 0 ? (
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                  {gallery.map((image) => (
                    <div
                      key={image.id ?? image.image_url}
                      className={`overflow-hidden rounded-3xl border ${surfaceClass}`}
                    >
                      <div className="relative aspect-[16/10] bg-slate-100">
                        {image.image_url ? (
                          <DefaultImage
                            src={image.image_url}
                            alt={image.image_path ?? item.title}
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                            {image.image_path ?? "Image"}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`mt-7 rounded-3xl border px-5 py-4 text-sm font-semibold ${surfaceClass}`}
                >
                  No gallery images yet.
                </p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function getFrameworkCodeLanguageLabels(
  frameworks: {
    framework_id?: string;
    framework?: {
      code_language_id?: string;
      code_language?: { title?: string } | null;
      code_language_mappings?: {
        code_language_id?: string;
        code_language?: { title?: string };
      }[];
    };
  }[],
) {
  const labels = frameworks.flatMap((mapping) => {
    const codeLanguageMappings =
      mapping.framework?.code_language_mappings ?? [];
    if (codeLanguageMappings.length > 0) {
      return codeLanguageMappings.map(
        (codeLanguageMapping) =>
          codeLanguageMapping.code_language?.title ??
          codeLanguageMapping.code_language_id,
      );
    }
    return [
      mapping.framework?.code_language?.title ??
        mapping.framework?.code_language_id,
    ];
  });

  return Array.from(new Set(labels.filter(Boolean)));
}

function InfoBlock({
  label,
  value,
  isDarkMode,
}: {
  label: string;
  value: string;
  isDarkMode: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
        {label}
      </p>
      <p className="mt-3 text-lg font-bold">{value}</p>
    </div>
  );
}

function TagGroup({
  title,
  values,
  emptyLabel,
  isDarkMode,
}: {
  title: string;
  values: (string | undefined)[];
  emptyLabel: string;
  isDarkMode: boolean;
}) {
  const items = values.filter(Boolean);
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold">{title}</h3>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((value) => (
            <span
              key={value}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                isDarkMode
                  ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-100"
                  : "border-sky-200 bg-sky-50 text-sky-800"
              }`}
            >
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>
      )}
    </div>
  );
}

function DetailSkeleton({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div
        className={`aspect-[16/11] animate-pulse rounded-[2rem] ${
          isDarkMode ? "bg-white/10" : "bg-slate-200"
        }`}
      />
      <div className="space-y-5">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className={`h-10 animate-pulse rounded-2xl ${
              isDarkMode ? "bg-white/10" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
