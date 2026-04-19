"use client";

import AdminShell from "../../admin_shell";
import { useCategoryLogic } from "./category_logic";

export default function CategoryUI() {
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
      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Category management
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">Categories</h3>
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
                  Title
                </th>
                <th className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Description
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
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-slate-300"
                  >
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-sm text-slate-300"
                  >
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((item) => (
                  <tr key={item.id} className="odd:bg-white/3">
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.title}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.description}
                    </td>
                    <td className="border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleString()
                        : "-"}
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

        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-300">
          <button
            type="button"
            disabled={currentPage <= 1 || isLoading}
            onClick={() => setPage(currentPage - 1)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
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
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
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
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200"
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
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200"
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
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200"
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
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200"
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
