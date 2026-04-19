"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "./admin_shell";
import { PortfolioTabKey, TableRow, TableView } from "./admin_logic";

type AdminTableUIProps = {
  activeKey:
    | "portfolio"
    | "achievement"
    | "work"
    | "code_language"
    | "framework"
    | "general";
  title: string;
  tableView: TableView;
  portfolioActiveKey?: PortfolioTabKey;
};

export default function AdminTableUI({
  activeKey,
  title,
  tableView,
  portfolioActiveKey,
}: AdminTableUIProps) {
  const [rows, setRows] = useState<TableRow[]>(tableView.rows);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<TableRow>({});

  useEffect(() => {
    setRows(tableView.rows);
  }, [tableView]);

  useEffect(() => {
    if (!isModalOpen) {
      setEditingIndex(null);
      setFormData({});
    }
  }, [isModalOpen]);

  const isEditing = editingIndex !== null;

  const openCreateModal = () => {
    const initialData = tableView.columns.reduce<TableRow>((acc, column) => {
      acc[column.key] = "";
      return acc;
    }, {});
    setFormData(initialData);
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rowIndex: number) => {
    setEditingIndex(rowIndex);
    setFormData({ ...rows[rowIndex] });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    const normalizedData = tableView.columns.reduce<TableRow>((acc, column) => {
      acc[column.key] = formData[column.key] ?? "";
      return acc;
    }, {});

    if (isEditing && editingIndex !== null) {
      setRows((prev) =>
        prev.map((row, rowIndex) => (rowIndex === editingIndex ? normalizedData : row)),
      );
    } else {
      setRows((prev) => [normalizedData, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (rowIndex: number) => {
    const rowLabel =
      rows[rowIndex]?.[tableView.columns[0]?.key ?? ""] ?? `row ${rowIndex + 1}`;
    const confirmed = window.confirm(
      `Delete ${rowLabel}? This will remove the sample row from the current page.`,
    );
    if (!confirmed) return;
    setRows((prev) => prev.filter((_, index) => index !== rowIndex));
  };

  const modalTitle = useMemo(
    () => (isEditing ? `Edit ${tableView.title}` : `Create ${tableView.title}`),
    [isEditing, tableView.title],
  );

  return (
    <AdminShell
      activeKey={activeKey}
      title={title}
      portfolioActiveKey={portfolioActiveKey}
    >
      <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
              Sample table
            </p>
            <h3 className="mt-2 text-2xl font-black text-white">{tableView.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
              {rows.length} rows
            </span>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-sky-500"
            >
              Create
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[1.25rem] border border-white/10">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-900/70">
                {tableView.columns.map((column) => (
                  <th
                    key={column.key}
                    className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300"
                  >
                    {column.label}
                  </th>
                ))}
                <th className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`${tableView.title}-${rowIndex}`} className="odd:bg-white/[0.03]">
                  {tableView.columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-sm text-slate-100"
                    >
                      {row[column.key]}
                    </td>
                  ))}
                  <td className="whitespace-nowrap border-b border-white/10 px-5 py-4 text-sm text-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(rowIndex)}
                        className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(rowIndex)}
                        className="rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/20"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[1.75rem] border border-white/10 bg-slate-950 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.45)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                    {isEditing ? "Edit record" : "Create record"}
                  </p>
                  <h4 className="mt-2 text-2xl font-black text-white">{modalTitle}</h4>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tableView.columns.map((column) => (
                  <label key={column.key} className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-200">{column.label}</span>
                    <input
                      value={formData[column.key] ?? ""}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          [column.key]: event.target.value,
                        }))
                      }
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                      placeholder={`Enter ${column.label.toLowerCase()}`}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
                >
                  {isEditing ? "Save Changes" : "Create"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
