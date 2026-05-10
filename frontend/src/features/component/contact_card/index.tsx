"use client";

import { GeneralResponse } from "@/features/core/domain/model/response/general_response";
import DefaultImage from "@/shared/component/ui/default_image";
import { useState } from "react";

const profileImageSrc = "/assets/profile.jpeg";

interface ContactCardProps {
  profile: GeneralResponse.Data | null;
  isDarkMode: boolean;
}

export default function ContactCard({ profile, isDarkMode }: ContactCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const socialLinks = [
    { key: "github", url: profile?.github_url, label: "GitHub" },
    { key: "linkedin", url: profile?.linkedin_url, label: "LinkedIn" },
    { key: "gitlab", url: profile?.gitlab_url, label: "GitLab" },
    { key: "threads", url: profile?.thread_url, label: "Threads" },
    { key: "tiktok", url: profile?.tiktok_url, label: "TikTok" },
  ].filter((link) => link.url);

  const hasSocialLinks = socialLinks.length > 0 || profile?.email;
  const profileInitial = (profile?.title || "S").charAt(0).toUpperCase();

  return (
    <article
      className={`overflow-hidden rounded-3xl shadow-lg transition-all duration-300 hover:-translate-y-1 ${
        isDarkMode
          ? "border border-white/10 bg-white/5"
          : "border border-slate-200 bg-white"
      }`}
    >
      <div className="relative aspect-4/3 max-h-56 overflow-hidden rounded-2xl bg-slate-100">
        {!hasImageError ? (
          <DefaultImage
            src={profileImageSrc}
            alt={profile?.title ?? "Profile photo"}
            sizes="(max-width: 768px) 100vw, 360px"
            style={{ objectFit: "cover" }}
            onError={() => setHasImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-sky-500 to-purple-600">
            <span className="text-6xl font-bold text-white">
              {profileInitial}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold leading-tight sm:text-2xl">
          Sahid Rahutomo
        </h3>
        <p className="mt-1 text-sm font-medium text-sky-500">
          Software Engineer
        </p>

        <p
          className={`mt-3 text-sm leading-relaxed ${
            isDarkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          Building digital experiences with modern technologies.
        </p>

        {profile?.email && (
          <div className="mt-5 flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isDarkMode ? "bg-white/10 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <a
              href={`mailto:${profile.email}`}
              className={`text-sm font-medium transition hover:text-sky-500 ${
                isDarkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              {profile.email}
            </a>
          </div>
        )}

        {hasSocialLinks && (
          <div className="mt-6">
            <div className="mb-3 h-px bg-slate-200 dark:bg-white/10" />
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 rounded-full border px-4 py-2 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    isDarkMode
                      ? "border-white/15 bg-white/5 text-white hover:border-sky-400 hover:text-sky-300"
                      : "border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-600"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-sky-400 hover:text-sky-600 dark:border-white/15 dark:bg-white/5 dark:text-white"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <a
            href="#contact"
            className="flex-1 rounded-full bg-sky-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-sky-600 hover:shadow-[0_10px_30px_rgba(14,165,233,0.3)]"
          >
            Contact Me
          </a>
          <a
            href={profile?.email ? `mailto:${profile.email}` : "#contact"}
            className="flex-1 rounded-full border border-sky-500 px-4 py-3 text-center text-sm font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white"
          >
            {profile?.email ? "Send Email" : "Get In Touch"}
          </a>
        </div>
      </div>
    </article>
  );
}
