"use client";

import { useGlobalLogic } from "@/shared/logic/global_logic";

export function useAdminTheme() {
  const { isDarkMode } = useGlobalLogic();

  return {
    isDarkMode,
    shellCardClass: isDarkMode
      ? "border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(15,23,42,0.2)]"
      : "border border-slate-200/70 bg-white/80 shadow-[0_18px_60px_rgba(148,163,184,0.18)]",
    panelClass: isDarkMode
      ? "border border-white/10 bg-slate-950/70"
      : "border border-slate-200/70 bg-white/80",
    modalClass: isDarkMode
      ? "border border-white/10 bg-slate-950"
      : "border border-slate-200/70 bg-white",
    sectionTitleClass: isDarkMode ? "text-slate-300" : "text-slate-600",
    headingClass: isDarkMode ? "text-white" : "text-slate-950",
    bodyTextClass: isDarkMode ? "text-slate-200" : "text-slate-700",
    mutedTextClass: isDarkMode ? "text-slate-300" : "text-slate-600",
    subtleTextClass: isDarkMode ? "text-slate-400" : "text-slate-500",
    tableHeaderRowClass: isDarkMode ? "bg-slate-900/70" : "bg-slate-200/80",
    tableHeaderTextClass: isDarkMode ? "text-slate-300" : "text-slate-600",
    tableBodyTextClass: isDarkMode ? "text-slate-100" : "text-slate-800",
    tableRowAltClass: isDarkMode ? "odd:bg-white/[0.03]" : "odd:bg-slate-50",
    tableBorderClass: isDarkMode ? "border-white/10" : "border-slate-200/70",
    tableStickyClass: isDarkMode
      ? "bg-slate-950/95 shadow-[-12px_0_24px_rgba(2,6,23,0.35)]"
      : "bg-white/95 shadow-[-12px_0_24px_rgba(148,163,184,0.18)]",
    tableWrapperClass: isDarkMode
      ? "border border-white/10"
      : "border border-slate-200/70",
    formLabelClass: isDarkMode ? "text-slate-200" : "text-slate-700",
    formInputClass: isDarkMode
      ? "border border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus:border-cyan-300"
      : "border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-sky-400",
    formPanelClass: isDarkMode
      ? "border border-white/10 bg-slate-950"
      : "border border-slate-200/70 bg-white",
    detailGridClass: isDarkMode ? "text-slate-300" : "text-slate-600",
    detailValueClass: isDarkMode ? "text-white" : "text-slate-950",
    buttonSurfaceClass: isDarkMode
      ? "border border-white/10 bg-white/5 text-slate-200"
      : "border border-slate-200 bg-white text-slate-700",
    actionViewButtonClass: isDarkMode
      ? "border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/20"
      : "border border-cyan-500 bg-cyan-600 text-white hover:bg-cyan-500",
    actionEditButtonClass: isDarkMode
      ? "border border-sky-300/30 bg-sky-400/10 text-sky-200 hover:bg-sky-400/20"
      : "border border-sky-500 bg-sky-600 text-white hover:bg-sky-500",
    actionDeleteButtonClass: isDarkMode
      ? "border border-rose-300/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20"
      : "border border-rose-500 bg-rose-600 text-white hover:bg-rose-500",
    actionButtonClass: isDarkMode
      ? "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
      : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
    detailBackdropClass: isDarkMode
      ? "bg-slate-950/70 backdrop-blur-sm"
      : "bg-slate-200/40 backdrop-blur-sm",
  };
}
