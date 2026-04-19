"use client";

import AdminShell from "../admin_shell";
import FileUploadField from "@/shared/component/ui/upload/file_upload_field";
import { useWorkLogic } from "./work_logic";

export default function WorkUI() {
  const {
    works,
    selectedWork,
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
    saveWork,
    deleteWork,
    uploadWorkImage,
    goToPage,
  } = useWorkLogic();

  const totalPages = Math.max(1, Math.ceil((total || works.length) / perPage));

  return (
    <AdminShell activeKey="work" title="Work">
      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Work records
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">Work list</h3>
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
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-900/70">
                <th className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Company
                </th>
                <th className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Job Title
                </th>
                <th className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Updated
                </th>
                <th className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-300">
                    Loading work data...
                  </td>
                </tr>
              ) : works.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-300">
                    No work data found.
                  </td>
                </tr>
              ) : (
                works.map((item) => (
                  <tr key={item.id} className="odd:bg-white/[0.03]">
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.company_name}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.job_title}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.updated_at ? new Date(item.updated_at).toLocaleString() : "-"}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
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

      {isDetailOpen && selectedWork ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  View work
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {selectedWork.job_title}
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
                ["Company", selectedWork.company_name],
                ["Company URL", selectedWork.company_url],
                ["Job title", selectedWork.job_title],
                ["Description", selectedWork.description],
                ["Start date", selectedWork.start_date ? new Date(selectedWork.start_date).toLocaleDateString() : "-"],
                ["End date", selectedWork.end_date ? new Date(selectedWork.end_date).toLocaleDateString() : "-"],
                ["Image path", selectedWork.image_path],
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
                  {isEditing ? "Update work" : "Create work"}
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
                <span className="text-sm font-semibold text-slate-200">Company name</span>
                <input
                  value={formState.company_name}
                  onChange={(event) => setFormField("company_name", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                  placeholder="Enter company name"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">Company URL</span>
                <input
                  type="url"
                  value={formState.company_url ?? ""}
                  onChange={(event) => setFormField("company_url", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                  placeholder="Enter company URL"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">Job title</span>
                <input
                  value={formState.job_title}
                  onChange={(event) => setFormField("job_title", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                  placeholder="Enter job title"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">Start date</span>
                <input
                  type="date"
                  value={formState.start_date}
                  onChange={(event) => setFormField("start_date", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-200">Description</span>
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormField("description", event.target.value)}
                  className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                  placeholder="Enter description"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">End date</span>
                <input
                  type="date"
                  value={formState.end_date ?? ""}
                  onChange={(event) => setFormField("end_date", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300"
                />
              </label>
              <div>
                <FileUploadField
                  label="Image"
                  value={formState.image_path}
                  isUploading={isUploading}
                  onUpload={uploadWorkImage}
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
                onClick={saveWork}
                disabled={isSubmitting || isUploading}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen && selectedWork ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Delete work
            </p>
            <h4 className="mt-2 text-2xl font-black text-white">
              Delete {selectedWork.job_title}?
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
                onClick={deleteWork}
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
