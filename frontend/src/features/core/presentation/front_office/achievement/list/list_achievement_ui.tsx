"use client";

import Link from "next/link";
import DefaultImage from "@/shared/component/ui/default_image";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { useAchievementList } from "./list_achievement_logic";

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

export default function ListAchievementUI() {
  const { isDarkMode, changeDarkMode } = useGlobalLogic();
  const { achievements, isLoading, errorMessage } = useAchievementList(100);

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
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Achievements
          </h1>
        </div>

        {isLoading && <LoadingRows isDarkMode={isDarkMode} />}
        {!isLoading && errorMessage && (
          <p className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            {errorMessage}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {achievements.map((item, index) => (
            <AchievementCard
              key={item.id ?? item.title ?? index}
              item={item}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        <EmptyState
          isVisible={!isLoading && achievements.length === 0}
          label="No achievement data yet."
          isDarkMode={isDarkMode}
        />
      </main>
    </div>
  );
}

function AchievementCard({
  item,
  isDarkMode,
}: ThemeProps & { item: AchievementResponse.Data }) {
  return (
    <article
      className={`animate-reveal overflow-hidden rounded-3xl shadow-sm transition duration-300 hover:-translate-y-2 ${
        isDarkMode
          ? "border border-white/10 bg-white/5"
          : "border border-slate-200 bg-white"
      }`}
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