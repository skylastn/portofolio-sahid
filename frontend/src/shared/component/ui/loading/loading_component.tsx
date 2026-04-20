import type { CSSProperties } from "react";

type LoadingComponentProps = {
  isDarkMode?: boolean;
  title?: string;
  subtitle?: string;
  eyebrow?: string;
};

export default function LoadingComponent({
  isDarkMode = false,
  title = "Loading",
  subtitle = "Please wait a moment.",
  eyebrow,
}: LoadingComponentProps) {
  const textClass = isDarkMode ? "text-slate-100" : "text-slate-900";
  const mutedTextClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const panelClass = isDarkMode
    ? "border border-white/10 bg-slate-950/72 shadow-[0_28px_90px_rgba(15,23,42,0.42)]"
    : "border border-slate-200/70 bg-white/82 shadow-[0_28px_90px_rgba(148,163,184,0.22)]";
  const accentClass = isDarkMode
    ? "bg-cyan-400/16 text-cyan-200"
    : "bg-sky-100 text-sky-700";
  const orbGlowClass = isDarkMode ? "bg-cyan-400/18" : "bg-sky-300/30";
  const loaderStyle = {
    ["--loader-ring-stop-soft" as string]: isDarkMode
      ? "rgba(34, 211, 238, 0.12)"
      : "rgba(14, 165, 233, 0.10)",
    ["--loader-ring-stop-strong" as string]: isDarkMode
      ? "rgba(34, 211, 238, 0.95)"
      : "rgba(14, 165, 233, 0.95)",
    ["--loader-ring-accent" as string]: isDarkMode
      ? "rgba(20, 184, 166, 0.95)"
      : "rgba(59, 130, 246, 0.95)",
    ["--loader-ring-shadow" as string]: isDarkMode
      ? "rgba(34, 211, 238, 0.38)"
      : "rgba(14, 165, 233, 0.34)",
    ["--loader-core-from" as string]: isDarkMode ? "#22d3ee" : "#0ea5e9",
    ["--loader-core-to" as string]: isDarkMode ? "#14b8a6" : "#3b82f6",
    ["--loader-core-ring" as string]: isDarkMode
      ? "rgba(34, 211, 238, 0.10)"
      : "rgba(14, 165, 233, 0.10)",
    ["--loader-core-glow" as string]: isDarkMode
      ? "rgba(20, 184, 166, 0.38)"
      : "rgba(59, 130, 246, 0.32)",
    ["--loader-pulse-border" as string]: isDarkMode
      ? "rgba(34, 211, 238, 0.20)"
      : "rgba(14, 165, 233, 0.18)",
  } as CSSProperties;

  return (
    <div
      className={`flex min-h-60 w-full max-w-md flex-col items-center justify-center gap-5 rounded-4xl px-8 py-9 text-center backdrop-blur-xl ${panelClass}`}
      style={loaderStyle}
      aria-live="polite"
      role="status"
    >
      <div className="relative flex items-center justify-center">
        <div
          className={`absolute inset-0 -z-10 h-24 w-24 rounded-full blur-2xl ${orbGlowClass}`}
          aria-hidden="true"
        />
        <div className="loader-modern" aria-hidden="true">
          <div className="loader-orb">
            <span className="loader-ring" />
            <span className="loader-core" />
            <span className="loader-pulse" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {eyebrow ? (
          <div
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${accentClass}`}
          >
            {eyebrow}
          </div>
        ) : null}
        <p className={`text-2xl font-black tracking-tight ${textClass}`}>
          {title}
        </p>
        <p className={`text-sm leading-6 ${mutedTextClass}`}>{subtitle}</p>
      </div>

      <span className="sr-only">{title}</span>
    </div>
  );
}
