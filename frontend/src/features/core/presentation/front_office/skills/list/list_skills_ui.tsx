"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CodeLanguageService } from "@/features/core/application/code_language_service";
import { FrameworkService } from "@/features/core/application/framework_service";
import { ToolService } from "@/features/core/application/tool_service";
import { CodeLanguageResponse } from "@/features/core/domain/model/response/code_language_response";
import { FrameworkResponse } from "@/features/core/domain/model/response/framework_response";
import { ToolResponse } from "@/features/core/domain/model/response/tool_response";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { EitherType } from "@/shared/utils/utility/either";

interface SkillsState {
  frameworks: FrameworkResponse.Data[];
  languages: CodeLanguageResponse.Data[];
  tools: ToolResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

function isPresentText(value?: string): value is string {
  return Boolean(value?.trim());
}

export default function ListSkillsUI() {
  const { isDarkMode, changeDarkMode } = useGlobalLogic();
  const [{ frameworks, languages, tools, isLoading, errorMessage }, setState] =
    useState<SkillsState>({
      frameworks: [],
      languages: [],
      tools: [],
      isLoading: true,
    });

  const fetchSkills = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMessage: undefined }));

    const frameworkService = new FrameworkService();
    const codeLanguageService = new CodeLanguageService();
    const toolService = new ToolService();
    const [frameworkResult, codeLanguageResult, toolResult] = await Promise.all([
      frameworkService.fetchFrameworks({ page: 1, perPage: 100 }),
      codeLanguageService.fetchCodeLanguages({ page: 1, perPage: 100 }),
      toolService.fetchTools({ page: 1, perPage: 100 }),
    ]);

    setState({
      frameworks:
        frameworkResult.tag === EitherType.Right
          ? (frameworkResult.right.data ?? [])
          : [],
      languages:
        codeLanguageResult.tag === EitherType.Right
          ? (codeLanguageResult.right.data ?? [])
          : [],
      tools:
        toolResult.tag === EitherType.Right ? (toolResult.right.data ?? []) : [],
      isLoading: false,
      errorMessage:
        frameworkResult.tag === EitherType.Left
          ? frameworkResult.left.message
          : codeLanguageResult.tag === EitherType.Left
            ? codeLanguageResult.left.message
            : toolResult.tag === EitherType.Left
              ? toolResult.left.message
              : undefined,
    });
  }, []);

  useEffect(() => {
    void fetchSkills();
  }, [fetchSkills]);

  const pageClass = isDarkMode
    ? "min-h-screen bg-slate-950 text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-950";
  const panelClass = isDarkMode
    ? "rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-sm"
    : "rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm";
  const itemClass = isDarkMode
    ? "rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200"
    : "rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700";

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
            SkyDeveloper
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
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">
            What I Do
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Skills and technologies
          </h1>
        </div>

        {errorMessage && (
          <p className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
            {errorMessage}
          </p>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <SkillPanel
            title="Frameworks"
            items={frameworks.map((item) => item.title).filter(isPresentText)}
            isLoading={isLoading}
            panelClass={panelClass}
            itemClass={itemClass}
          />
          <SkillPanel
            title="Languages"
            items={languages.map((item) => item.title).filter(isPresentText)}
            isLoading={isLoading}
            panelClass={panelClass}
            itemClass={itemClass}
          />
          <SkillPanel
            title="Tools"
            items={tools.map((item) => item.title).filter(isPresentText)}
            isLoading={isLoading}
            panelClass={panelClass}
            itemClass={itemClass}
          />
        </div>
      </main>
    </div>
  );
}

function SkillPanel({
  title,
  items,
  isLoading,
  panelClass,
  itemClass,
}: {
  title: string;
  items: string[];
  isLoading: boolean;
  panelClass: string;
  itemClass: string;
}) {
  return (
    <article className={panelClass}>
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <li
                key={index}
                className="h-11 animate-pulse rounded-2xl bg-slate-400/20"
              />
            ))
          : items.map((item) => (
              <li key={item} className={itemClass}>
                {item}
              </li>
            ))}
      </ul>
      {!isLoading && items.length === 0 && (
        <p className="mt-5 text-sm text-slate-500">No data yet.</p>
      )}
    </article>
  );
}
