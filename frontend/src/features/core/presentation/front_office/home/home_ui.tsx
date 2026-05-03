"use client";

import { useState } from "react";
import { useHomeLogic, usePublicContent } from "./home_logic";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import { PublicHomePreviewSections } from "../component/home_component";

export default function HomeUI() {
  const { navItems, socialLinks, skillGroups, heroStats } = useHomeLogic();
  const { changeDarkMode, isDarkMode } = useGlobalLogic();
  const publicContent = usePublicContent(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pageClass = isDarkMode
    ? "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_46%,_#111827_100%)] text-slate-100"
    : "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,208,255,0.22),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_46%,_#ffffff_100%)] text-slate-900";
  const headerClass = isDarkMode
    ? "animate-slide-down sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl"
    : "animate-slide-down sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl";
  const brandClass = isDarkMode ? "text-white" : "text-slate-950";
  const navClass = isDarkMode
    ? "hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex"
    : "hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex";
  const panelClass = isDarkMode
    ? "rounded-[1.75rem] border border-white/10 bg-white/5 p-7 shadow-[0_20px_60px_rgba(15,23,42,0.3)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(15,23,42,0.42)]"
    : "rounded-[1.75rem] border border-slate-200/70 bg-white/85 p-7 shadow-[0_20px_60px_rgba(148,163,184,0.15)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(148,163,184,0.22)]";
  const mutedTextClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const strongTextClass = isDarkMode ? "text-white" : "text-slate-950";
  const badgeClass = isDarkMode
    ? "animate-reveal inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-sm font-semibold text-cyan-200 [animation-delay:0.05s]"
    : "animate-reveal inline-flex rounded-full border border-sky-200 bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700 [animation-delay:0.05s]";
  const secondaryButtonClass = isDarkMode
    ? "rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:text-cyan-200"
    : "rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition duration-300 hover:-translate-y-1 hover:border-sky-400 hover:text-sky-700";
  const socialClass = isDarkMode
    ? "animate-reveal rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:text-cyan-200"
    : "animate-reveal rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-700";
  const listItemClass = isDarkMode
    ? "rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-slate-200"
    : "rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700";

  return (
    <div className={pageClass}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`animate-float-slow absolute top-0 left-0 h-72 w-72 rounded-full blur-3xl ${
            isDarkMode ? "bg-cyan-400/15" : "bg-cyan-300/20"
          }`}
        />
        <div
          className={`animate-float-delayed absolute top-32 right-0 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-blue-400/15" : "bg-blue-300/20"
          }`}
        />
      </div>

      <header className={headerClass}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className={`text-base font-black tracking-tight sm:text-xl ${brandClass}`}
          >
            {"<SkyDeveloper />"}
          </a>

          <nav className={navClass}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-sky-500"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={changeDarkMode}
              aria-label="Toggle dark mode"
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition duration-300 ${
                isDarkMode
                  ? "border-white/15 bg-white/5 text-white hover:border-cyan-300 hover:text-cyan-200"
                  : "border-slate-300 bg-white text-slate-800 hover:border-sky-400 hover:text-sky-700"
              }`}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </button>

            <a
              href="#contact"
              className={`rounded-full  ${isDarkMode ? "bg-slate-950" : "bg-sky-400"} px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600`}
            >
              Contact Me
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition md:hidden ${
              isDarkMode
                ? "border-white/15 bg-white/5 text-white"
                : "border-slate-300 bg-white text-slate-900"
            }`}
          >
            <span className="text-lg">{isMobileMenuOpen ? "x" : "☰"}</span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className={`border-t px-4 py-4 md:hidden ${
              isDarkMode
                ? "border-white/10 bg-slate-950/95"
                : "border-slate-200 bg-white/95"
            }`}
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                    isDarkMode
                      ? "bg-white/5 text-slate-200"
                      : "bg-slate-50 text-slate-700"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={changeDarkMode}
                className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                  isDarkMode
                    ? "border-white/15 bg-white/5 text-white"
                    : "border-slate-300 bg-white text-slate-800"
                }`}
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-full bg-sky-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Contact Me
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="relative">
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span
              className={`${badgeClass} max-w-full text-center text-xs sm:text-sm`}
            >
              Software Engineer
            </span>

            <h1
              className={`animate-reveal mt-5 text-4xl font-black tracking-tight [animation-delay:0.15s] sm:mt-6 sm:text-5xl lg:text-6xl ${strongTextClass}`}
            >
              Hi, I&apos;m Sky.
              <br />I build clean, modern, and production-ready web experiences.
            </h1>

            <p
              className={`animate-reveal mt-5 max-w-2xl text-base leading-7 [animation-delay:0.25s] sm:mt-6 sm:text-lg sm:leading-8 ${mutedTextClass}`}
            >
              This portfolio is inspired by DeveloperFolio: a personal landing
              page that introduces who I am, what I build, the technologies I
              use, and the work I am proud to ship.
            </p>

            <div className="animate-reveal mt-8 flex flex-col gap-3 [animation-delay:0.35s] sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="#projects"
                className="rounded-full bg-sky-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(2,132,199,0.25)] transition duration-300 hover:-translate-y-1 hover:bg-sky-500 hover:shadow-[0_20px_40px_rgba(2,132,199,0.35)]"
              >
                See My Work
              </a>
              <a
                href="#contact"
                className={`${secondaryButtonClass} text-center`}
              >
                Get In Touch
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              {socialLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`${socialClass} justify-center text-center`}
                  style={{ animationDelay: `${0.45 + index * 0.1}s` }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="animate-reveal relative order-first [animation-delay:0.3s] lg:order-none">
            <div
              className={`animate-pulse-soft absolute -top-5 -left-2 h-20 w-20 rounded-3xl blur-2xl sm:-top-6 sm:-left-4 sm:h-24 sm:w-24 ${
                isDarkMode ? "bg-cyan-300/30" : "bg-amber-200/70"
              }`}
            />
            <div className="animate-float-card relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.24)] sm:p-8">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>

              <div className="mt-8 space-y-4 sm:mt-10">
                <p className="text-xs uppercase tracking-[0.24em] text-sky-300 sm:text-sm sm:tracking-[0.3em]">
                  Current Focus
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Frontend systems with strong UX and maintainable architecture.
                </h2>
                <p className="text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                  I enjoy turning ideas into interfaces that feel clear, fast,
                  and intentionally crafted across desktop and mobile.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
                {heroStats.map((item) => (
                  <InfoTile
                    key={item.title}
                    title={item.title}
                    value={item.value}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="skills"
          className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
        >
          <SectionHeading
            eyebrow="What I Do"
            title="Skills and technologies I use to ship polished products"
            isDarkMode={isDarkMode}
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {skillGroups.map((group, index) => (
              <article
                key={group.title}
                className={`animate-reveal ${panelClass}`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <h3 className={`text-xl font-bold ${strongTextClass}`}>
                  {group.title}
                </h3>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className={listItemClass}>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <PublicHomePreviewSections
          isDarkMode={isDarkMode}
          portofolios={publicContent.portofolios}
          works={publicContent.works}
          achievements={publicContent.achievements}
          isLoading={publicContent.isLoading}
          errorMessage={publicContent.errorMessage}
        />

        <section
          id="contact"
          className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="animate-reveal rounded-[2rem] bg-slate-950 px-5 py-10 text-white shadow-[0_35px_90px_rgba(15,23,42,0.26)] sm:px-8 sm:py-12 [animation-delay:0.1s]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300 sm:text-sm sm:tracking-[0.3em]">
              Contact Me
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">
              Let&apos;s build something useful, fast, and memorable together.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
              You can replace this section with your real email, social links,
              resume URL, and any direct call-to-action you want visitors to
              take next.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="mailto:hello@example.com"
                className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-100"
              >
                hello@example.com
              </a>
              <a
                href="https://github.com"
                className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-sky-300 hover:text-sky-200"
              >
                github.com/your-profile
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  isDarkMode,
}: {
  eyebrow: string;
  title: string;
  isDarkMode: boolean;
}) {
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

function InfoTile({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        {title}
      </p>
      <p className="mt-3 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  );
}
