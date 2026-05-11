"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
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
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(
    null,
  );
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
  const titleClass = isDarkMode ? "text-white" : "text-slate-950";
  const categories = item?.category_mappings ?? [];
  const frameworks = item?.framework_mappings ?? [];
  const tools = item?.tool_mappings ?? [];
  const codeLanguages = getFrameworkCodeLanguageLabels(frameworks);
  const sources = item?.apps_sources ?? [];
  const gallery = item?.images ?? [];
  const activeGalleryImage =
    activeGalleryIndex !== null ? gallery[activeGalleryIndex] : undefined;
  const closeGallery = useCallback(() => setActiveGalleryIndex(null), []);
  const showPreviousGalleryImage = useCallback(() => {
    setActiveGalleryIndex((current) => {
      if (current === null || gallery.length === 0) return current;
      return current === 0 ? gallery.length - 1 : current - 1;
    });
  }, [gallery.length]);
  const showNextGalleryImage = useCallback(() => {
    setActiveGalleryIndex((current) => {
      if (current === null || gallery.length === 0) return current;
      return current === gallery.length - 1 ? 0 : current + 1;
    });
  }, [gallery.length]);

  useEffect(() => {
    if (activeGalleryIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") showPreviousGalleryImage();
      if (event.key === "ArrowRight") showNextGalleryImage();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeGalleryIndex,
    closeGallery,
    showNextGalleryImage,
    showPreviousGalleryImage,
  ]);

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
            <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <div className="relative overflow-hidden rounded-4xl bg-slate-950 shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
                <div className="relative aspect-16/11">
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

                <div className="mt-7 flex flex-wrap gap-3">
                  {sources.map((source) => (
                    <a
                      key={source.id ?? source.url}
                      href={source.url ?? "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-sky-500"
                    >
                      <SourceIcon type={source.type} />
                      {getSourceLabel(source.type)}
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

            <section className="mt-12">
              <InfoSummary
                detail={item.description ?? "No description available."}
                items={[
                  {
                    label: "Company",
                    value: item.work?.company_name ?? "Independent",
                  },
                  {
                    label: "Role",
                    value: item.work?.job_title ?? "Project",
                  },
                  {
                    label: "Timeline",
                    value: `${formatDisplayDate(item.work?.start_date)} - ${formatDisplayDate(item.work?.end_date)}`,
                  },
                ]}
                isDarkMode={isDarkMode}
              />
            </section>

            <section className="mt-12">
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
                <TagGroup
                  title="Tools"
                  values={tools.map((mapping) => mapping.tool?.title ?? mapping.tool_id)}
                  emptyLabel="No tools."
                  isDarkMode={isDarkMode}
                />
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
                  {gallery.map((image, index) => (
                    <button
                      type="button"
                      key={image.id ?? image.image_url}
                      onClick={() => setActiveGalleryIndex(index)}
                      className={`group overflow-hidden rounded-3xl border text-left transition hover:-translate-y-1 ${surfaceClass}`}
                    >
                      <div className="relative aspect-16/10 bg-slate-100">
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
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/0 opacity-0 transition group-hover:bg-slate-950/35 group-hover:opacity-100">
                          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950">
                            View fullscreen
                          </span>
                        </div>
                      </div>
                    </button>
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

      {activeGalleryImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 px-4 py-6 backdrop-blur">
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute inset-0 cursor-default"
            onClick={closeGallery}
          />
          <div className="relative z-10 flex h-full w-full max-w-7xl flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold text-slate-300">
                {activeGalleryImage.image_path ??
                  item?.title ??
                  "Gallery image"}
              </p>
              <button
                type="button"
                onClick={closeGallery}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl bg-black">
              {activeGalleryImage.image_url ? (
                <DefaultImage
                  src={activeGalleryImage.image_url}
                  alt={
                    activeGalleryImage.image_path ??
                    item?.title ??
                    "Gallery image"
                  }
                  style={{ objectFit: "contain" }}
                  sizes="100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-400">
                  {activeGalleryImage.image_path ?? "Image"}
                </div>
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousGalleryImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold text-white transition hover:bg-white/20"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={showNextGalleryImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/10 text-2xl font-bold text-white transition hover:bg-white/20"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && activeGalleryIndex !== null && (
              <p className="text-center text-sm font-semibold text-slate-400">
                {activeGalleryIndex + 1} / {gallery.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getSourceLabel(type?: string) {
  if (!type) return "Open source";
  const labels: Record<string, string> = {
    android: "Android",
    web: "Web",
    ios: "iOS",
    windows: "Windows",
    mac: "macOS",
    linux: "Linux",
    github: "GitHub",
    other: "Source",
  };
  return labels[type.toLowerCase()] ?? type;
}

function SourceIcon({ type }: { type?: string }) {
  const normalizedType = type?.toLowerCase();
  const iconClass = "h-4 w-4 shrink-0";

  if (normalizedType === "android") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.2 8.6h9.6c.9 0 1.7.8 1.7 1.7v5.8c0 .9-.8 1.7-1.7 1.7h-.5v2.1c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1v-2.1H9.9v2.1c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1v-2.1h-.5c-.9 0-1.7-.8-1.7-1.7v-5.8c0-.9.8-1.7 1.7-1.7Zm-4.1 1.7c.6 0 1.1.5 1.1 1.1v4.3c0 .6-.5 1.1-1.1 1.1S2 16.3 2 15.7v-4.3c0-.6.5-1.1 1.1-1.1Zm17.8 0c.6 0 1.1.5 1.1 1.1v4.3c0 .6-.5 1.1-1.1 1.1s-1.1-.5-1.1-1.1v-4.3c0-.6.5-1.1 1.1-1.1ZM8 3.1l1.2 2.1c.8-.3 1.8-.5 2.8-.5s2 .2 2.8.5L16 3.1c.2-.3.5-.4.8-.2.3.2.4.5.2.8l-1.1 2c1.1.6 1.9 1.4 2.3 2.4H5.8c.4-1 1.2-1.8 2.3-2.4L7 3.7c-.2-.3-.1-.6.2-.8.3-.2.6-.1.8.2Zm1.3 3.2c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7Zm5.4 0c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7Z" />
      </svg>
    );
  }

  if (normalizedType === "ios" || normalizedType === "mac") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.8 12.8c0-2 1.6-3 1.7-3.1-1-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2.1.8-1.2 1.1-2.3 1.1-2.4 0-.1-2.6-1-2.6-3.6ZM14.8 6.8c.6-.7 1-1.7.9-2.8-.9 0-1.9.6-2.5 1.3-.6.7-1 1.7-.9 2.7 1 .1 1.9-.5 2.5-1.2Z" />
      </svg>
    );
  }

  if (normalizedType === "github") {
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 0 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.5-1.1-4.5-5 0-1.1.4-2 1-2.8-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1.1.8-.2 1.6-.3 2.5-.3s1.7.1 2.5.3c1.9-1.4 2.8-1.1 2.8-1.1.5 1.4.2 2.4.1 2.7.6.7 1 1.7 1 2.8 0 3.9-2.3 4.7-4.5 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2Z" />
      </svg>
    );
  }

  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18m0 18a9 9 0 1 1 0-18m0 18c2.5-2.4 3.8-5.4 3.8-9S14.5 5.4 12 3m0 18c-2.5-2.4-3.8-5.4-3.8-9S9.5 5.4 12 3M3.6 9h16.8M3.6 15h16.8" />
    </svg>
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

function InfoSummary({
  detail,
  items,
  isDarkMode,
}: {
  detail: string;
  items: { label: string; value: string }[];
  isDarkMode: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
      }`}
    >
      <p
        className={`whitespace-pre-line text-base leading-8 ${
          isDarkMode ? "text-slate-300" : "text-slate-600"
        }`}
      >
        {detail}
      </p>
      <div className="mt-6 grid gap-5 border-t border-white/10 pt-5 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
              {item.label}
            </p>
            <p className="mt-3 text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>
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
        className={`aspect-16/11 animate-pulse rounded-4xl ${
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
