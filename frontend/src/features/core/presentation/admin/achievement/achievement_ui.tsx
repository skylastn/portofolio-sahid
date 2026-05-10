"use client";

import AdminShell from "../component/admin_shell";
import { useAdminTheme } from "../styles/admin_theme";
import DefaultImage from "@/shared/component/ui/default_image";
import FileUploadField from "@/shared/component/ui/upload/file_upload_field";
import { useAchievementLogic } from "./achievement_logic";

export default function AchievementUI() {
  const theme = useAdminTheme();
  const {
    achievements,
    selectedAchievement,
    isLoading,
    isSubmitting,
    isUploading,
    isDetailOpen,
    isFormOpen,
    isDeleteOpen,
    isEditing,
    formState,
    currentPage,
    perPage,
    total,
    openCreateForm,
    openViewModal,
    openEditForm,
    openDeleteDialog,
    closeModal,
    setFormField,
    saveAchievement,
    deleteAchievement,
    uploadAchievementImage,
    goToPage,
  } = useAchievementLogic();

  const totalPages = Math.max(
    1,
    Math.ceil((total || achievements.length) / perPage),
  );
  const formatDateTime = (value?: string | Date | null) =>
    value ? new Date(value).toLocaleString() : "-";
  const twoLineClampStyle: React.CSSProperties = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
    wordBreak: "break-word",
  };

  return (
    <AdminShell activeKey="achievement" title="Achievement">
      <div className={`rounded-[1.8rem] p-6 ${theme.shellCardClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-[0.24em] ${theme.sectionTitleClass}`}
            >
              Achievement records
            </p>
            <h3 className={`mt-2 text-2xl font-black ${theme.headingClass}`}>
              Achievement list
            </h3>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-500"
          >
            Create
          </button>
        </div>

        <div
          className={`mt-6 overflow-x-auto rounded-[1.25rem] ${theme.tableWrapperClass}`}
        >
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr className={theme.tableHeaderRowClass}>
                <th
                  className={`w-27.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Number
                </th>
                <th
                  className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Title
                </th>
                <th
                  className={`w-60 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Description
                </th>
                <th
                  className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Date
                </th>
                <th
                  className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Image path
                </th>
                <th
                  className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Image url
                </th>
                <th
                  className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Created
                </th>
                <th
                  className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Updated
                </th>
                <th
                  className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Deleted
                </th>
                <th
                  className={`sticky right-0 z-30 w-35 whitespace-nowrap border-b border-l px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableStickyClass} ${theme.tableHeaderTextClass}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={10}
                    className={`px-5 py-10 text-center text-sm ${theme.mutedTextClass}`}
                  >
                    Loading achievement data...
                  </td>
                </tr>
              ) : achievements.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className={`px-5 py-10 text-center text-sm ${theme.mutedTextClass}`}
                  >
                    No achievement data found.
                  </td>
                </tr>
              ) : (
                achievements.map((item, index) => (
                  <tr key={item.id} className={theme.tableRowAltClass}>
                    <td
                      className={`align-top border-b px-3 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      <div className="leading-6" style={twoLineClampStyle}>
                        {(currentPage - 1) * perPage + index + 1}
                      </div>
                    </td>
                    <td
                      className={`align-top border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      <div className="leading-6" style={twoLineClampStyle}>
                        {item.title}
                      </div>
                    </td>
                    <td
                      className={`align-top border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      <div className="leading-6" style={twoLineClampStyle}>
                        {item.description}
                      </div>
                    </td>
                    <td
                      className={`align-top border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      <div className="leading-6" style={twoLineClampStyle}>
                        {formatDateTime(item.date)}
                      </div>
                    </td>
                    <td
                      className={`align-top border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      <div className="leading-6" style={twoLineClampStyle}>
                        {item.image_path ?? "-"}
                      </div>
                    </td>
                    <td
                      className={`align-top border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      {item.image_url ? (
                        <div className="h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                          <DefaultImage
                            src={item.image_url}
                            alt={item.title ?? "achievement image"}
                            className="h-full w-full"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <div className="leading-6" style={twoLineClampStyle}>
                          -
                        </div>
                      )}
                    </td>
                    <td
                      className={`align-top border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}
                    >
                      <div className="leading-6" style={twoLineClampStyle}>
                        {formatDateTime(item.created_at)}
                      </div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>
                        {formatDateTime(item.updated_at)}
                      </div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>
                        {formatDateTime(item.deleted_at)}
                      </div>
                    </td>
                    <td
                      className={`sticky right-0 z-20 border-b border-l px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableStickyClass} ${theme.tableBodyTextClass}`}
                    >
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

        <div
          className={`mt-4 flex items-center justify-between gap-3 text-sm ${theme.mutedTextClass}`}
        >
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className={`rounded-full px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${theme.actionButtonClass}`}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`rounded-full px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${theme.actionButtonClass}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isDetailOpen && selectedAchievement ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  View achievement
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {selectedAchievement.title}
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

            <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {[
                ["Description", selectedAchievement.description],
                [
                  "Date",
                  selectedAchievement.date
                    ? new Date(selectedAchievement.date).toLocaleDateString()
                    : "-",
                ],
                ["Image path", selectedAchievement.image_path],
                [
                  "Updated",
                  selectedAchievement.updated_at
                    ? new Date(selectedAchievement.updated_at).toLocaleString()
                    : "-",
                ],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {label}
                  </p>
                  <p className="mt-2 break-all text-sm text-white">
                    {value ?? "-"}
                  </p>
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
                  {isEditing ? "Update achievement" : "Create achievement"}
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
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">
                  Title
                </span>
                <input
                  value={formState.title}
                  onChange={(event) =>
                    setFormField("title", event.target.value)
                  }
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="Enter title"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">
                  Date
                </span>
                <input
                  type="date"
                  value={formState.date}
                  onChange={(event) => setFormField("date", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">
                  Position
                </span>
                <input
                  type="number"
                  value={formState.position ?? 0}
                  onChange={(event) =>
                    setFormField("position", event.target.value)
                  }
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="0"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-200">
                  Description
                </span>
                <textarea
                  value={formState.description}
                  onChange={(event) =>
                    setFormField("description", event.target.value)
                  }
                  className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="Enter description"
                />
              </label>
              <div className="md:col-span-2">
                <FileUploadField
                  label="Image"
                  value={formState.image_path}
                  isUploading={isUploading}
                  onUpload={uploadAchievementImage}
                />
              </div>
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
                onClick={saveAchievement}
                disabled={isSubmitting || isUploading}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen && selectedAchievement ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Delete achievement
            </p>
            <h4 className="mt-2 text-2xl font-black text-white">
              Delete {selectedAchievement.title}?
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
                onClick={deleteAchievement}
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
