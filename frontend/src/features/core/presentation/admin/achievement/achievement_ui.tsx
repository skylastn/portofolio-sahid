"use client";

import AdminShell from "../admin_shell";
import DefaultImage from "@/shared/component/ui/default_image";
import FileUploadField from "@/shared/component/ui/upload/file_upload_field";
import { useAchievementLogic } from "./achievement_logic";

export default function AchievementUI() {
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

  const totalPages = Math.max(1, Math.ceil((total || achievements.length) / perPage));
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
      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Achievement records
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">Achievement list</h3>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-500"
          >
            Create
          </button>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-white/10">
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-900/70">
                <th className="w-27.5 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Number
                </th>
                <th className="w-37.5 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Title
                </th>
                <th className="w-60 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Description
                </th>
                <th className="w-30 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Date
                </th>
                <th className="w-37.5 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Image path
                </th>
                <th className="w-37.5 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Image url
                </th>
                <th className="w-30 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Created
                </th>
                <th className="w-30 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Updated
                </th>
                <th className="w-30 whitespace-nowrap border-b border-white/10 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Deleted
                </th>
                <th className="sticky right-0 z-30 w-35 whitespace-nowrap border-b border-l border-white/10 bg-slate-900/95 px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 shadow-[-12px_0_24px_rgba(2,6,23,0.35)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-slate-300">
                    Loading achievement data...
                  </td>
                </tr>
              ) : achievements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-slate-300">
                    No achievement data found.
                  </td>
                </tr>
              ) : (
                achievements.map((item, index) => (
                  <tr key={item.id} className="odd:bg-white/[0.03]">
                    <td className="align-top border-b border-white/10 px-3 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>
                        {(currentPage - 1) * perPage + index + 1}
                      </div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{item.title}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{item.description}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{formatDateTime(item.date)}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{item.image_path ?? "-"}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
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
                        <div className="leading-6" style={twoLineClampStyle}>-</div>
                      )}
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{formatDateTime(item.created_at)}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{formatDateTime(item.updated_at)}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{formatDateTime(item.deleted_at)}</div>
                    </td>
                    <td className="sticky right-0 z-20 border-b border-l border-white/10 bg-slate-950/95 px-5 py-4 text-sm text-slate-100 shadow-[-12px_0_24px_rgba(2,6,23,0.35)]">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openViewModal(item)}
                          className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/20"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteDialog(item)}
                          className="rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/20"
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

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-300">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 font-semibold text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              {[
                ["Description", selectedAchievement.description],
                ["Date", selectedAchievement.date ? new Date(selectedAchievement.date).toLocaleDateString() : "-"],
                ["Image path", selectedAchievement.image_path],
                ["Updated", selectedAchievement.updated_at ? new Date(selectedAchievement.updated_at).toLocaleString() : "-"],
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
                  {isEditing ? "Update achievement" : "Create achievement"}
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {isEditing ? "Edit form" : "Create form"}
                </h4>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">Title</span>
                <input
                  value={formState.title}
                  onChange={(event) => setFormField("title", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="Enter title"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">Date</span>
                <input
                  type="date"
                  value={formState.date}
                  onChange={(event) => setFormField("date", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-200">Description</span>
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormField("description", event.target.value)}
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
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveAchievement}
                disabled={isSubmitting || isUploading}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
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
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200"
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
