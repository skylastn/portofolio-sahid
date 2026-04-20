"use client";

import AdminShell from "../../component/admin_shell";
import DefaultImage from "@/shared/component/ui/default_image";
import FileUploadField from "@/shared/component/ui/upload/file_upload_field";
import { useAdminTheme } from "../../styles/admin_theme";
import { usePortofolioLogic } from "./portfolio_logic";

export default function PortofolioUI() {
  const theme = useAdminTheme();
  const {
    portofolios,
    selectedPortofolio,
    isLoading,
    isDetailLoading,
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
    savePortofolio,
    deletePortofolio,
    uploadPortofolioThumbnail,
    goToPage,
  } = usePortofolioLogic();

  const totalPages = Math.max(1, Math.ceil((total || portofolios.length) / perPage));
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
    <AdminShell activeKey="portfolio" title="Portfolio" portfolioActiveKey="portfolio">
      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Portfolio records
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">Portfolio list</h3>
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
          <table className="min-w-full table-fixed border-separate border-spacing-0">
            <thead>
              <tr className={theme.tableHeaderRowClass}>
                <th className={`w-27.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Number
                </th>
                <th className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Title
                </th>
                <th className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Work
                </th>
                <th className={`w-55 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Description
                </th>
                <th className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Thumbnail path
                </th>
                <th className={`w-37.5 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Thumbnail url
                </th>
                <th className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Created
                </th>
                <th className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Updated
                </th>
                <th className={`w-30 whitespace-nowrap border-b px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableHeaderTextClass}`}>
                  Deleted
                </th>
                <th className={`sticky right-0 z-30 w-35 whitespace-nowrap border-b border-l px-3 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] ${theme.tableBorderClass} ${theme.tableStickyClass} ${theme.tableHeaderTextClass}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-slate-300">
                    Loading portfolio data...
                  </td>
                </tr>
              ) : portofolios.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-10 text-center text-sm text-slate-300">
                    No portfolio data found.
                  </td>
                </tr>
              ) : (
                portofolios.map((item, index) => (
                  <tr key={item.id} className="odd:bg-white/3">
                    <td className="align-top border-b border-white/10 px-3 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>
                        {(currentPage - 1) * perPage + index + 1}
                      </div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{item.title}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>
                        {item.work?.job_title ?? item.work?.company_name ?? item.work_id ?? "-"}
                      </div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{item.description}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      <div className="leading-6" style={twoLineClampStyle}>{item.thumbnail_path ?? "-"}</div>
                    </td>
                    <td className="align-top border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.thumbnail_url ? (
                        <div className="h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                          <DefaultImage
                            src={item.thumbnail_url}
                            alt={item.title ?? "portfolio thumbnail"}
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

      {isDetailOpen && selectedPortofolio ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
          <div className="my-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950">
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  View portfolio
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {selectedPortofolio.title}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(selectedPortofolio)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${theme.actionEditButtonClass}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${theme.actionButtonClass}`}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="max-h-[calc(90vh-120px)] overflow-y-auto px-6 pb-6">
              {isDetailLoading ? (
                <div className="mt-6 flex min-h-80 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-sm text-slate-300">
                  Loading portfolio detail...
                </div>
              ) : (
                <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/5 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Work
                        </p>
                        <p className="mt-2 text-sm text-white">
                          {selectedPortofolio.work?.job_title ??
                            selectedPortofolio.work?.company_name ??
                            selectedPortofolio.work_id ??
                            "-"}
                        </p>
                        {selectedPortofolio.work?.company_url ? (
                          <p className="mt-2 break-all text-xs text-slate-400">
                            {selectedPortofolio.work.company_url}
                          </p>
                        ) : null}
                      </div>
                      <div className="rounded-2xl bg-white/5 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Thumbnail
                        </p>
                        <p className="mt-2 break-all text-sm text-white">
                          {selectedPortofolio.thumbnail_path ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Thumbnail preview
                        </p>
                        <div className="mt-3 flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
                          {selectedPortofolio.thumbnail_url ? (
                            <DefaultImage
                              src={selectedPortofolio.thumbnail_url}
                              alt={selectedPortofolio.title ?? "portfolio thumbnail"}
                              className="h-full w-full"
                              sizes="480px"
                            />
                          ) : (
                            <span className="text-sm text-slate-400">No thumbnail preview</span>
                          )}
                        </div>
                      </div>

                      <div className="rounded-2xl bg-white/5 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                          Description
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-white">
                          {selectedPortofolio.description ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Gallery
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {(selectedPortofolio.images ?? []).length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-4 py-8 text-sm text-slate-400 sm:col-span-2 xl:col-span-3">
                            No gallery images.
                          </div>
                        ) : (
                          (selectedPortofolio.images ?? []).map((image) => (
                            <div
                              key={image.id}
                              className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60"
                            >
                              <div className="flex h-44 items-center justify-center bg-slate-900/50">
                                {image.image_url ? (
                                  <DefaultImage
                                    src={image.image_url}
                                    alt={image.image_path ?? "portfolio image"}
                                    className="h-full w-full"
                                    sizes="320px"
                                  />
                                ) : (
                                  <span className="px-4 text-center text-sm text-slate-400">
                                    {image.image_path ?? "-"}
                                  </span>
                                )}
                              </div>
                              <div className="px-4 py-3">
                                <p className="break-all text-xs text-slate-400">
                                  {image.image_path ?? "-"}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-4">
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Apps Sources
                      </p>
                      <div className="mt-3 flex flex-col gap-3">
                        {(selectedPortofolio.apps_sources ?? []).length === 0 ? (
                          <p className="text-sm text-slate-300">No app sources.</p>
                        ) : (
                          (selectedPortofolio.apps_sources ?? []).map((source) => (
                            <div
                              key={source.id}
                              className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                                {source.type ?? "other"}
                              </p>
                              <p className="mt-2 break-all text-sm text-white">
                                {source.url ?? "-"}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Categories
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedPortofolio.category_mappings ?? []).length === 0 ? (
                          <p className="text-sm text-slate-300">No categories.</p>
                        ) : (
                          (selectedPortofolio.category_mappings ?? []).map((mapping) => (
                            <span
                              key={mapping.id}
                              className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
                            >
                              {mapping.category?.title ?? mapping.category_id}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Frameworks
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedPortofolio.framework_mappings ?? []).length === 0 ? (
                          <p className="text-sm text-slate-300">No frameworks.</p>
                        ) : (
                          (selectedPortofolio.framework_mappings ?? []).map((mapping) => (
                            <span
                              key={mapping.id}
                              className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-100"
                            >
                              {mapping.framework?.title ?? mapping.framework_id}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        ["Created", selectedPortofolio.created_at ? new Date(selectedPortofolio.created_at).toLocaleString() : "-"],
                        ["Updated", selectedPortofolio.updated_at ? new Date(selectedPortofolio.updated_at).toLocaleString() : "-"],
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
              )}
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
                  {isEditing ? "Update portfolio" : "Create portfolio"}
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
                <span className="text-sm font-semibold text-slate-200">Work ID</span>
                <input
                  value={formState.work_id ?? ""}
                  onChange={(event) => setFormField("work_id", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="Enter work id"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-200">Title</span>
                <input
                  value={formState.title}
                  onChange={(event) => setFormField("title", event.target.value)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="Enter title"
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
                  label="Thumbnail"
                  value={formState.thumbnail_path}
                  isUploading={isUploading}
                  onUpload={uploadPortofolioThumbnail}
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
                onClick={savePortofolio}
                disabled={isSubmitting || isUploading}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen && selectedPortofolio ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Delete portfolio
            </p>
            <h4 className="mt-2 text-2xl font-black text-white">
              Delete {selectedPortofolio.title}?
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
                onClick={deletePortofolio}
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
