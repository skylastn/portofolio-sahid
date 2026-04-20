"use client";

import AdminShell from "../component/admin_shell";
import { useAdminTheme } from "../styles/admin_theme";
import { useGeneralLogic } from "./general_logic";

const fieldLabels: Array<{
  key: keyof ReturnType<typeof useGeneralLogic>["formState"];
  label: string;
  type?: string;
}> = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "email", label: "Email", type: "email" },
  { key: "github_url", label: "GitHub URL", type: "url" },
  { key: "gitlab_url", label: "GitLab URL", type: "url" },
  { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
  { key: "thread_url", label: "Threads URL", type: "url" },
  { key: "tiktok_url", label: "TikTok URL", type: "url" },
];

export default function GeneralUI() {
  const theme = useAdminTheme();
  const {
    generals,
    selectedGeneral,
    isLoading,
    isSubmitting,
    isDetailOpen,
    isFormOpen,
    isDeleteOpen,
    isEditing,
    formState,
    openCreateForm,
    openViewModal,
    openEditForm,
    openDeleteDialog,
    closeModal,
    setFormField,
    saveGeneral,
    deleteGeneral,
  } = useGeneralLogic();

  return (
    <AdminShell
      activeKey="general"
      title="General Settings"
    >
      <div className={`rounded-[1.8rem] p-6 ${theme.shellCardClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${theme.sectionTitleClass}`}>
              General content
            </p>
            <h3 className={`mt-2 text-2xl font-black ${theme.headingClass}`}>General profile data</h3>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-500"
          >
            Create
          </button>
        </div>

        <div className={`mt-6 overflow-x-auto rounded-[1.25rem] ${theme.tableWrapperClass}`}>
          <table className="min-w-full border-collapse">
            <thead>
              <tr className={theme.tableHeaderRowClass}>
                <th className={`whitespace-nowrap border-b px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Title
                </th>
                <th className={`whitespace-nowrap border-b px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Email
                </th>
                <th className={`whitespace-nowrap border-b px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Updated
                </th>
                <th className={`whitespace-nowrap border-b px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className={`px-5 py-10 text-center text-sm ${theme.mutedTextClass}`}
                  >
                    Loading general data...
                  </td>
                </tr>
              ) : generals.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className={`px-5 py-10 text-center text-sm ${theme.mutedTextClass}`}
                  >
                    No general data found.
                  </td>
                </tr>
              ) : (
                generals.map((item) => (
                  <tr key={item.id} className={theme.tableRowAltClass}>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      {item.title}
                    </td>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      {item.email}
                    </td>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      {item.updated_at ? new Date(item.updated_at).toLocaleString() : "-"}
                    </td>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openViewModal(item)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme.actionViewButtonClass}`}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme.actionEditButtonClass}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(item)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${theme.actionDeleteButtonClass}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDetailOpen && selectedGeneral ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  View general
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">{selectedGeneral.title}</h4>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className={`rounded-full px-3 py-2 text-sm font-semibold ${theme.buttonSurfaceClass}`}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {[
                ["Description", selectedGeneral.description],
                ["Email", selectedGeneral.email],
                ["GitHub", selectedGeneral.github_url],
                ["GitLab", selectedGeneral.gitlab_url],
                ["LinkedIn", selectedGeneral.linkedin_url],
                ["Threads", selectedGeneral.thread_url],
                ["TikTok", selectedGeneral.tiktok_url],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 break-all text-sm text-white">{value ?? "-"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  {isEditing ? "Update general" : "Create general"}
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {isEditing ? "Edit form" : "Create form"}
                </h4>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className={`rounded-full px-3 py-2 text-sm font-semibold ${theme.buttonSurfaceClass}`}
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {fieldLabels.map((field) => (
                <label key={field.key} className="flex flex-col gap-2 md:col-span-1">
                  <span className="text-sm font-semibold text-slate-200">{field.label}</span>
                  {field.key === "description" ? (
                    <textarea
                      value={formState[field.key]}
                      onChange={(event) => setFormField(field.key, event.target.value)}
                      className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      value={formState[field.key]}
                      onChange={(event) => setFormField(field.key, event.target.value)}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${theme.buttonSurfaceClass}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveGeneral}
                disabled={isSubmitting}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen && selectedGeneral ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Delete general
            </p>
            <h4 className="mt-2 text-2xl font-black text-white">
              Delete {selectedGeneral.title}?
            </h4>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className={`rounded-full px-5 py-3 text-sm font-semibold ${theme.buttonSurfaceClass}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteGeneral}
                disabled={isSubmitting}
                className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AdminShell>
  );
}
