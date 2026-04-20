"use client";

import AdminShell from "../../component/admin_shell";
import { useAdminTheme } from "../../styles/admin_theme";
import { useCategoryLogic } from "./category_logic";

export default function CategoryUI() {
  const theme = useAdminTheme();
  const {
    categories,
    selectedCategory,
    isLoading,
    isSubmitting,
    isDetailOpen,
    isFormOpen,
    isDeleteOpen,
    isEditing,
    formState,
    currentPage,
    totalPages,
    openCreateForm,
    openViewModal,
    openEditForm,
    openDeleteDialog,
    closeModal,
    setFormField,
    saveCategory,
    deleteCategory,
    setPage,
  } = useCategoryLogic();

  return (
    <AdminShell
      activeKey="portfolio"
      portfolioActiveKey="category"
      title="Portfolio Category"
    >
      <div className={`rounded-[1.8rem] p-6 ${theme.shellCardClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${theme.sectionTitleClass}`}>
              Category management
            </p>
            <h3 className={`mt-2 text-2xl font-black ${theme.headingClass}`}>Categories</h3>
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
                  Description
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
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className={`px-5 py-10 text-center text-sm ${theme.mutedTextClass}`}
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item.id} className={theme.tableRowAltClass}>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      {item.title}
                    </td>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      {item.description}
                    </td>
                    <td className={`border-b px-5 py-4 text-sm ${theme.tableBorderClass} ${theme.tableBodyTextClass}`}>
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleString()
                        : "-"}
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

        <div className={`mt-5 flex items-center justify-between gap-3 text-sm ${theme.mutedTextClass}`}>
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setPage(currentPage - 1)}
            className={`rounded-full px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${theme.actionButtonClass}`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || isLoading}
            onClick={() => setPage(currentPage + 1)}
            className={`rounded-full px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${theme.actionButtonClass}`}
          >
            Next
          </button>
        </div>
      </div>

      {isDetailOpen && selectedCategory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  View category
                </p>
                <h4 className="mt-2 text-2xl font-black text-white">
                  {selectedCategory.title}
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
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-white">Description: </span>
                {selectedCategory.description ?? "-"}
              </p>
              <p>
                <span className="font-semibold text-white">ID: </span>
                {selectedCategory.id}
              </p>
              <p>
                <span className="font-semibold text-white">Created: </span>
                {selectedCategory.created_at
                  ? new Date(selectedCategory.created_at).toLocaleString()
                  : "-"}
              </p>
              <p>
                <span className="font-semibold text-white">Updated: </span>
                {selectedCategory.updated_at
                  ? new Date(selectedCategory.updated_at).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {isFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  {isEditing ? "Update category" : "Create category"}
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

            <div className="mt-6 grid gap-4">
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
                <span className="text-sm font-semibold text-slate-200">Description</span>
                <textarea
                  value={formState.description}
                  onChange={(event) => setFormField("description", event.target.value)}
                  className="min-h-32 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden focus:border-cyan-300"
                  placeholder="Enter description"
                />
              </label>
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
                onClick={saveCategory}
                disabled={isSubmitting}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isDeleteOpen && selectedCategory ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Delete category
            </p>
            <h4 className="mt-2 text-2xl font-black text-white">
              Delete {selectedCategory.title}?
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
                onClick={deleteCategory}
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
