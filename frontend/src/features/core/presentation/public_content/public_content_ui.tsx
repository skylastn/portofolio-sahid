"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";
import DefaultImage from "@/shared/component/ui/default_image";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import {
  PublicContentType,
  formatDisplayDate,
  usePublicContent,
} from "./public_content_logic";

interface ThemeProps {
  isDarkMode: boolean;
}

interface HomePreviewProps extends ThemeProps {
  portofolios: PortofolioResponse.Data[];
  works: WorkResponse.Data[];
  achievements: AchievementResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

const sectionMeta = {
  portofolio: {
    eyebrow: "Portofolio",
    title: "Project work selected from the backend portfolio API",
    href: "/portofolio",
  },
  work: {
    eyebrow: "Work",
    title: "Professional experience pulled from work records",
    href: "/work",
  },
  achievement: {
    eyebrow: "Achievements",
    title: "Recognition and milestones from achievement records",
    href: "/achievement",
  },
};

export function PublicHomePreviewSections(props: HomePreviewProps) {
  return (
    <>
      <PreviewSection
        type="portofolio"
        isDarkMode={props.isDarkMode}
        isLoading={props.isLoading}
        errorMessage={props.errorMessage}
      >
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {props.portofolios.map((item, index) => (
            <PortofolioCard
              key={item.id ?? item.title ?? index}
              item={item}
              index={index}
            />
          ))}
        </div>
        <EmptyState
          isVisible={!props.isLoading && props.portofolios.length === 0}
          label="No portofolio data yet."
          isDarkMode={props.isDarkMode}
        />
      </PreviewSection>

      <PreviewSection
        type="work"
        isDarkMode={props.isDarkMode}
        isLoading={props.isLoading}
        errorMessage={props.errorMessage}
      >
        <div className="mt-10 space-y-5">
          {props.works.map((item, index) => (
            <WorkCard
              key={item.id ?? `${item.company_name ?? "work"}-${item.job_title ?? index}`}
              item={item}
              index={index}
              isDarkMode={props.isDarkMode}
            />
          ))}
        </div>
        <EmptyState
          isVisible={!props.isLoading && props.works.length === 0}
          label="No work data yet."
          isDarkMode={props.isDarkMode}
        />
      </PreviewSection>

      <PreviewSection
        type="achievement"
        isDarkMode={props.isDarkMode}
        isLoading={props.isLoading}
        errorMessage={props.errorMessage}
      >
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {props.achievements.map((item, index) => (
            <AchievementCard
              key={item.id ?? item.title ?? index}
              item={item}
              index={index}
              isDarkMode={props.isDarkMode}
            />
          ))}
        </div>
        <EmptyState
          isVisible={!props.isLoading && props.achievements.length === 0}
          label="No achievement data yet."
          isDarkMode={props.isDarkMode}
        />
      </PreviewSection>
    </>
  );
}

export function PublicListingPage({ type }: { type: PublicContentType }) {
  const { isDarkMode, changeDarkMode } = useGlobalLogic();
  const { portofolios, works, achievements, isLoading, errorMessage } =
    usePublicContent(100);
  const meta = sectionMeta[type];
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
            {"<SkyDeveloper />"}
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            {meta.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            {meta.title}
          </h1>
        </div>

        {isLoading && <LoadingRows isDarkMode={isDarkMode} />}
        {!isLoading && errorMessage && (
          <p className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            {errorMessage}
          </p>
        )}

        {type === "portofolio" && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {portofolios.map((item, index) => (
              <PortofolioCard key={item.id ?? item.title ?? index} item={item} />
            ))}
          </div>
        )}

        {type === "work" && (
          <div className="mt-10 space-y-5">
            {works.map((item, index) => (
              <WorkCard
                key={item.id ?? `${item.company_name ?? "work"}-${item.job_title ?? index}`}
                item={item}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        {type === "achievement" && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item, index) => (
              <AchievementCard
                key={item.id ?? item.title ?? index}
                item={item}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        <EmptyState
          isVisible={
            !isLoading &&
            ((type === "portofolio" && portofolios.length === 0) ||
              (type === "work" && works.length === 0) ||
              (type === "achievement" && achievements.length === 0))
          }
          label={`No ${meta.eyebrow.toLowerCase()} data yet.`}
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}

function PreviewSection({
  type,
  isDarkMode,
  isLoading,
  errorMessage,
  children,
}: PropsWithChildren<
  ThemeProps & {
    type: PublicContentType;
    isLoading: boolean;
    errorMessage?: string;
  }
>) {
  const meta = sectionMeta[type];
  return (
    <section
      id={type === "portofolio" ? "projects" : type}
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={meta.eyebrow} title={meta.title} isDarkMode={isDarkMode} />
        <Link
          href={meta.href}
          className={`w-fit rounded-full border px-5 py-2.5 text-sm font-semibold transition hover:-translate-y-1 ${
            isDarkMode
              ? "border-white/15 bg-white/5 text-white hover:border-cyan-300"
              : "border-slate-300 bg-white text-slate-800 hover:border-sky-400"
          }`}
        >
          View all
        </Link>
      </div>
      {isLoading ? <LoadingRows isDarkMode={isDarkMode} /> : children}
      {!isLoading && errorMessage && (
        <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
          {errorMessage}
        </p>
      )}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  isDarkMode,
}: ThemeProps & { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 sm:text-sm sm:tracking-[0.28em]">
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl ${
          isDarkMode ? "text-white" : "text-slate-950"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}

function PortofolioCard({
  item,
  index = 0,
}: {
  item: PortofolioResponse.Data;
  index?: number;
}) {
  const frameworks = item.framework_mappings
    ?.map((mapping) => mapping.framework?.title)
    .filter(Boolean)
    .slice(0, 3);
  const content = (
    <>
      <div className="relative aspect-[16/10] bg-slate-800">
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
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
          {item.work?.company_name ?? "Selected Work"}
        </p>
        <h3 className="mt-3 text-2xl font-bold">{item.title ?? "Untitled"}</h3>
        <p className="mt-4 clamp-2 text-base leading-7 text-slate-300">
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
        className="animate-reveal overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_25px_70px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-2"
        style={{ animationDelay: `${0.1 + index * 0.12}s` }}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      className="animate-reveal overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_25px_70px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-2"
      style={{ animationDelay: `${0.1 + index * 0.12}s` }}
    >
      {content}
    </article>
  );
}

function WorkCard({
  item,
  index = 0,
  isDarkMode,
}: ThemeProps & { item: WorkResponse.Data; index?: number }) {
  return (
    <article
      className={`animate-reveal grid gap-5 rounded-3xl p-6 shadow-sm transition duration-300 hover:-translate-y-1 lg:grid-cols-[180px_1fr] ${
        isDarkMode
          ? "border border-white/10 bg-white/5"
          : "border border-slate-200 bg-white"
      }`}
      style={{ animationDelay: `${0.1 + index * 0.12}s` }}
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

function AchievementCard({
  item,
  index = 0,
  isDarkMode,
}: ThemeProps & { item: AchievementResponse.Data; index?: number }) {
  return (
    <article
      className={`animate-reveal overflow-hidden rounded-3xl shadow-sm transition duration-300 hover:-translate-y-2 ${
        isDarkMode
          ? "border border-white/10 bg-white/5"
          : "border border-slate-200 bg-white"
      }`}
      style={{ animationDelay: `${0.1 + index * 0.12}s` }}
    >
      <div className="relative aspect-[16/9] bg-slate-100">
        {item.image_url ? (
          <DefaultImage
            src={item.image_url}
            alt={item.title}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-slate-500">
            {formatDisplayDate(item.date)}
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          {formatDisplayDate(item.date)}
        </p>
        <h3 className="mt-3 text-2xl font-bold">{item.title ?? "Achievement"}</h3>
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
