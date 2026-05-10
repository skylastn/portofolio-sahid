"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";
import DefaultImage from "@/shared/component/ui/default_image";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { ToolResponse } from "@/features/core/domain/model/response/tool_response";
import { formatDisplayDate } from "@/features/core/presentation/front_office/home/home_logic";

interface ThemeProps {
  isDarkMode: boolean;
}

interface HomePreviewProps extends ThemeProps {
  portofolios: PortofolioResponse.Data[];
  works: WorkResponse.Data[];
  achievements: AchievementResponse.Data[];
  tools: ToolResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

const sectionMeta = {
  portofolio: {
    title: "Portofolio",
    href: "/portofolio",
  },
  work: {
    title: "Work",
    href: "/work",
  },
  achievement: {
    title: "Achievements",
    href: "/achievement",
  },
  tools: {
    title: "Tools",
    href: "/tools",
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

      <PreviewSection
        type="tools"
        isDarkMode={props.isDarkMode}
        isLoading={props.isLoading}
        errorMessage={props.errorMessage}
      >
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {props.tools.map((item, index) => (
            <ToolCard
              key={item.id ?? index}
              item={item}
              index={index}
              isDarkMode={props.isDarkMode}
            />
          ))}
        </div>
        <EmptyState
          isVisible={!props.isLoading && props.tools.length === 0}
          label="No tools data yet."
          isDarkMode={props.isDarkMode}
        />
      </PreviewSection>
    </>
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
    type: "portofolio" | "work" | "achievement" | "tools";
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
        <SectionHeading title={meta.title} isDarkMode={isDarkMode} />
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
  title,
  isDarkMode,
}: ThemeProps & { title: string }) {
  return (
    <div className="max-w-3xl">
      <h2
        className={`text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl ${
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
      <div className="relative aspect-16/10 bg-slate-800">
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
      <div className="relative aspect-video bg-slate-100">
        {item.image_url ? (
          <DefaultImage
            src={item.image_url}
            alt={item.title}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-slate-500">
            {item.date}
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-700">
          {item.date}
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

function ToolCard({
  item,
  index = 0,
  isDarkMode,
}: ThemeProps & { item: ToolResponse.Data; index?: number }) {
  return (
    <article
      className={`animate-reveal overflow-hidden rounded-3xl p-4 text-center transition duration-300 hover:-translate-y-2 ${
        isDarkMode
          ? "border border-white/10 bg-white/5"
          : "border border-slate-200 bg-white"
      }`}
      style={{ animationDelay: `${0.1 + index * 0.12}s` }}
    >
      <div className="relative aspect-square bg-slate-100">
        {item.image_url ? (
          <DefaultImage
            src={item.image_url}
            alt={item.title ?? "Tool"}
            style={{ objectFit: "contain" }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-lg font-black text-sky-700">
            {(item.title ?? "T").slice(0, 1)}
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold">{item.title ?? "Untitled Tool"}</h3>
        {item.description && (
          <p
            className={`mt-2 text-sm ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {item.description}
          </p>
        )}
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