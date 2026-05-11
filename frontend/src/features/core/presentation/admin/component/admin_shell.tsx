"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useAuthLogic } from "@/shared/logic/auth_logic";
import { useGlobalLogic } from "@/shared/logic/global_logic";
import {
  adminNavigationItems,
  AdminNavigationItem,
  PortfolioTabKey,
} from "../admin_logic";

type AdminShellProps = {
  activeKey: AdminNavigationItem["key"];
  title: string;
  children: React.ReactNode;
  portfolioActiveKey?: PortfolioTabKey;
};

export default function AdminShell({
  activeKey,
  title,
  children,
  portfolioActiveKey,
}: AdminShellProps) {
  const router = useRouter();
  const { logout } = useAuthLogic();
  const { changeDarkMode, isDarkMode } = useGlobalLogic();

  const pageClass = isDarkMode
    ? "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_22%),linear-gradient(180deg,_#020617_0%,_#0b1120_45%,_#111827_100%)] text-slate-100"
    : "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_20%),linear-gradient(180deg,_#f8fbff_0%,_#edf4ff_44%,_#ffffff_100%)] text-slate-900";
  const shellClass = isDarkMode
    ? "border border-white/10 bg-slate-950/70 text-slate-100 shadow-[0_30px_100px_rgba(15,23,42,0.45)] backdrop-blur-xl"
    : "border border-slate-200/70 bg-white/80 text-slate-900 shadow-[0_30px_100px_rgba(148,163,184,0.18)] backdrop-blur-xl";
  const mutedTextClass = isDarkMode ? "text-slate-300" : "text-slate-600";
  const strongTextClass = isDarkMode ? "text-white" : "text-slate-950";
  const activeNavClass = isDarkMode
    ? "border-cyan-300 bg-cyan-400/10 text-cyan-200"
    : "border-sky-400 bg-sky-50 text-sky-700";
  const inactiveNavClass = isDarkMode
    ? "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300 hover:text-cyan-200"
    : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700";
  const viewSiteButtonClass =
    "rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600";
  const viewSiteButtonStyle: React.CSSProperties = {
    backgroundColor: "#0284c7",
    color: "#ffffff",
  };
  const logoutButtonClass = isDarkMode
    ? "rounded-full border border-rose-300/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/15"
    : "rounded-full border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100";
  const shellGridStyle: React.CSSProperties = {
    maxWidth: 1800,
    gridTemplateColumns: "290px minmax(0, 1fr)",
  };
  const adminThemeStyle: React.CSSProperties = isDarkMode
    ? {
        ["--admin-table-head-text" as string]: "#cbd5e1",
        ["--admin-table-head-bg" as string]: "rgba(15, 23, 42, 0.82)",
        ["--admin-table-body-text" as string]: "#f8fafc",
        ["--admin-surface-heading" as string]: "#ffffff",
        ["--admin-surface-muted" as string]: "#cbd5e1",
      }
    : {
        ["--admin-table-head-text" as string]: "#64748b",
        ["--admin-table-head-bg" as string]: "rgba(241, 245, 249, 0.95)",
        ["--admin-table-body-text" as string]: "#0f172a",
        ["--admin-surface-heading" as string]: "#0f172a",
        ["--admin-surface-muted" as string]: "#475569",
      };

  const renderNavButton = (item: AdminNavigationItem, nested = false) => {
    const isActive =
      activeKey === item.key ||
      (item.key === "portfolio" && portfolioActiveKey !== undefined);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
          isActive ? activeNavClass : inactiveNavClass
        } ${nested ? "ml-4" : ""}`}
      >
        <span>{item.label}</span>
        {item.children ? <span className="text-xs">›</span> : null}
      </Link>
    );
  };

  const handleLogout = async () => {
    await logout();
    void router.replace("/auth/login");
  };

  return (
    <div className={`admin-theme ${pageClass}`} style={adminThemeStyle}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`animate-float-slow absolute top-0 left-0 h-80 w-80 rounded-full blur-3xl ${
            isDarkMode ? "bg-cyan-400/15" : "bg-sky-300/25"
          }`}
        />
        <div
          className={`animate-float-delayed absolute top-24 right-0 h-96 w-96 rounded-full blur-3xl ${
            isDarkMode ? "bg-blue-400/10" : "bg-indigo-200/30"
          }`}
        />
      </div>

      <div
        className="relative mx-auto grid min-h-screen w-full gap-6 px-4 py-4 sm:px-6 lg:px-8"
        style={shellGridStyle}
      >
        <aside
          className={`${shellClass} sticky top-4 flex h-fit flex-col gap-6 rounded-4xl p-5`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl font-black ${
                  isDarkMode
                    ? "bg-cyan-400/15 text-cyan-200"
                    : "bg-sky-100 text-sky-700"
                }`}
              >
                AD
              </div>
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-[0.3em] ${mutedTextClass}`}
                >
                  Admin panel
                </p>
                <h1
                  className={`text-lg font-black tracking-tight ${strongTextClass}`}
                >
                  Portfolio
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={changeDarkMode}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                isDarkMode
                  ? "border-white/10 bg-white/5 text-slate-200"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              {isDarkMode ? "Light" : "Dark"}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {adminNavigationItems.map((item) => (
              <div key={item.href} className="flex flex-col gap-2">
                {renderNavButton(item)}
                {item.children && activeKey === "portfolio" ? (
                  <div className="flex flex-col gap-2 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                          portfolioActiveKey === child.key
                            ? activeNavClass
                            : inactiveNavClass
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div
            className={`rounded-3xl border p-4 ${isDarkMode ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"}`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-[0.24em] ${mutedTextClass}`}
            >
              Quick note
            </p>
            <p className={`mt-2 text-sm leading-6 ${mutedTextClass}`}>
              This is an admin console. Navigation on the left opens separate
              pages, while the right side shows the selected module.
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-6">
          <div className={`${shellClass} rounded-4xl px-6 py-5`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2
                  className={`text-3xl font-black tracking-tight sm:text-4xl ${strongTextClass}`}
                >
                  {title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className={viewSiteButtonClass}
                  style={viewSiteButtonStyle}
                >
                  View site
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={logoutButtonClass}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          <div className="min-w-0">{children}</div>
        </section>
      </div>
    </div>
  );
}
