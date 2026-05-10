"use client";

import AdminShell from "../component/admin_shell";
import { useAdminTheme } from "../styles/admin_theme";
import DefaultImage from "@/shared/component/ui/default_image";
import FileUploadField from "@/shared/component/ui/upload/file_upload_field";
import { useFrameworkLogic } from "./framework_logic";

export default function FrameworkUI() {
  const theme = useAdminTheme();
  const {
    frameworks,
    codeLanguages,
    selectedFramework,
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
    toggleCodeLanguageMapping,
    saveFramework,
    deleteFramework,
    uploadFrameworkImage,
    goToPage,
  } = useFrameworkLogic();

  const totalPages = Math.max(
    1,
    Math.ceil((total || frameworks.length) / perPage),
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
  const getCodeLanguageTitle = (id?: string) =>
    codeLanguages.find((entry) => entry.id === id)?.title ?? id ?? "-";
  const getMappedCodeLanguageTitles = (item?: typeof selectedFramework) =>
    (item?.code_language_mappings ?? [])
      .map(
        (mapping) =>
          mapping.code_language?.title ??
          getCodeLanguageTitle(mapping.code_language_id),
      )
      .filter(Boolean);

  return (
    <AdminShell activeKey="framework" title="Framework">
      <div className={`rounded-[1.8rem] p-6 ${theme.shellCardClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-[0.24em] ${theme.sectionTitleClass}`}
            >
              Framework records
            </p>
            <h3 className={`mt-2 text-2xl font-black ${theme.headingClass}`}>
              Framework list
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
                  className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Code Language
                </th>
                <th
                  className={`w-55 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
                >
                  Description
                </th>
                <th
                  className={`w-35 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}
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
                    className="px-5 py-10 text-center text-sm text-slate-300"
                  >
                    Loading framework data...
                  </td>
                </tr>
              ) : frameworks.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-10 text-center text-sm text-slate-300"
                  >
                    No framework data found.
                  </td>
                </tr>
              ) : (
                frameworks.map((item, index) => {
                  const codeLanguageTitle =
                    item.code_language?.title ??
                    getCodeLanguageTitle(item.code_language_id);
                  return (
                    <tr key={item.id} className="odd:bg-white/[0.03]">
                      <td className="align-top border-b border-white/10 px-3 py-4 text-sm text-slate-100">
                        <div className="leading-6" style={twoLineClampStyle}>
                          {(currentPage - 1) * perPage + index + 1}
                        </div>
                      </td>
                      <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                        <div className="leading-6" style={twoLineClampStyle}>
                          {item.title}
                        </div>
                      </td>
                      <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                        <div className="leading-6" style={twoLineClampStyle}>
                          {codeLanguageTitle}
                        </div>
                      </td>
                      <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                        <div className="leading-6" style={twoLineClampStyle}>
                          {item.description}
                        </div>
                      </td>
                      <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                        <div className="leading-6" style={twoLineClampStyle}>
                          {item.image_path ?? "-"}
                        </div>
                      </td>
                      <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                        {item.image_url ? (
                          <div className="h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                            <DefaultImage
                              src={item.image_url}
                              alt={item.title ?? "framework image"}
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
                      <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
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
                      <td className="sticky right-0 z-20 border-b border-l border-white/10 bg-slate-950/95 px-5 py-4 text-sm text-slate-100 shadow-[-12px_0_24px_rgba(2,6,23,0.35)]">
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
                  );
                })
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

      {isDetailOpen && selectedFramework ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  View framework
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {selectedFramework.title}
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
                [
                  "Code language",
                  selectedFramework.code_language?.title ??
                    getCodeLanguageTitle(selectedFramework.code_language_id),
                ],
                [
                  "Mapped languages",
                  getMappedCodeLanguageTitles(selectedFramework).join(", "),
                ],
                ["Description", selectedFramework.description],
                ["Image path", selectedFramework.image_path],
                [
                  "Updated",
                  selectedFramework.updated_at
                    ? new Date(selectedFramework.updated_at).toLocaleString()
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
                  {isEditing ? "Update framework" : "Create framework"}
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
                  Code language
                </span>
                <select
                  value={formState.code_language_id}
                  onChange={(event) =>
                    setFormField("code_language_id", event.target.value)
                  }
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                >
                  <option value="">Select code language</option>
                  {codeLanguages.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-2 md:col-span-2">
                <span className="text-sm font-semibold text-slate-200">
                  Mapped code languages
                </span>
                <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-3">
                  {codeLanguages.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2 text-sm font-medium text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={(formState.code_language_ids ?? []).includes(
                          item.id ?? "",
                        )}
                        onChange={() =>
                          item.id && toggleCodeLanguageMapping(item.id)
                        }
                        className="h-4 w-4 accent-sky-500"
                      />
                      <span>{item.title}</span>
                    </label>
                  ))}
                  {codeLanguages.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No code language data found.
                    </p>
                  ) : null}
                </div>
              </div>
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
                  onUpload={uploadFrameworkImage}
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
                onClick={saveFramework}
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

      {isDeleteOpen && selectedFramework ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Delete framework
            </p>
            <h4 className="mt-2 text-2xl font-black text-white">
              Delete {selectedFramework.title}?
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
                onClick={deleteFramework}
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
