"use client";

import AdminShell from "../../admin_shell";
import DefaultImage from "@/shared/component/ui/default_image";
import FileUploadField from "@/shared/component/ui/upload/file_upload_field";
import {
  portofolioAppSourceTypes,
  usePortofolioFormLogic,
} from "./portfolio_form_logic";

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function PortofolioFormUI() {
  const {
    mode,
    isLoading,
    isSubmitting,
    isUploadingThumbnail,
    isUploadingImage,
    portfolio,
    works,
    categories,
    frameworks,
    formState,
    openBack,
    setFormField,
    addAppsSource,
    updateAppsSource,
    removeAppsSource,
    toggleCategory,
    toggleFramework,
    removeImage,
    uploadThumbnail,
    uploadImage,
    savePortofolio,
  } = usePortofolioFormLogic();

  const isEditMode = mode === "edit";
  const selectedWork = works.find((item) => item.id === formState.work_id);

  if (isLoading) {
    return (
      <AdminShell
        activeKey="portfolio"
        title={isEditMode ? "Edit Portfolio" : "Create Portfolio"}
        portfolioActiveKey="portfolio"
      >
        <SectionCard title="Loading portfolio">
          <p className="text-sm text-slate-300">
            Fetching portfolio data and related options...
          </p>
        </SectionCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      activeKey="portfolio"
      title={isEditMode ? "Edit Portfolio" : "Create Portfolio"}
      portfolioActiveKey="portfolio"
    >
      <div className="flex flex-col gap-6">
        <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.2)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                Portfolio {isEditMode ? "update" : "create"}
              </p>
              <h3 className="mt-2 text-3xl font-black text-white">
                {isEditMode
                  ? (portfolio?.title ?? "Edit portfolio")
                  : "Create portfolio"}
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openBack}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Back
              </button>
              <button
                type="button"
                onClick={savePortofolio}
                disabled={isSubmitting}
                className="rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Portfolio"
                    : "Create Portfolio"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.95fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <SectionCard
              title="Basic Information"
              subtitle="Title, work, description, and thumbnail."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Title
                  </span>
                  <input
                    value={formState.title}
                    onChange={(event) =>
                      setFormField("title", event.target.value)
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                    placeholder="Enter title"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Work
                  </span>
                  <select
                    value={formState.work_id}
                    onChange={(event) =>
                      setFormField("work_id", event.target.value)
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  >
                    <option value="">Select work</option>
                    {works.map((work) => (
                      <option key={work.id} value={work.id}>
                        {work.company_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="md:col-span-2 flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-200">
                    Description
                  </span>
                  <textarea
                    value={formState.description}
                    onChange={(event) =>
                      setFormField("description", event.target.value)
                    }
                    className="min-h-40 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-hidden transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                    placeholder="Enter description"
                  />
                </label>

                <div className="md:col-span-2">
                  <FileUploadField
                    label="Thumbnail"
                    value={formState.thumbnail_path}
                    isUploading={isUploadingThumbnail}
                    onUpload={uploadThumbnail}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Work preview
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Selected work
                    </p>
                    <p className="mt-2 text-sm text-white">
                      {selectedWork
                        ? `${selectedWork.job_title ?? selectedWork.company_name}`
                        : "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Thumbnail
                    </p>
                    <p className="mt-2 break-all text-sm text-white">
                      {formState.thumbnail_path || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Apps Sources"
              subtitle="Add every app or source link related to this portfolio."
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-300">
                  Use URLs and type labels that match the backend enum.
                </p>
                <button
                  type="button"
                  onClick={addAppsSource}
                  className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  Add Source
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                {formState.apps_sources.map((item, index) => (
                  <div
                    key={`${item.id || "new"}-${index}`}
                    className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[minmax(0,1fr)_180px_auto]"
                  >
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        URL
                      </span>
                      <input
                        value={item.url}
                        onChange={(event) =>
                          updateAppsSource(index, "url", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-hidden transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                        placeholder="https://"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Type
                      </span>
                      <select
                        value={item.type}
                        onChange={(event) =>
                          updateAppsSource(index, "type", event.target.value)
                        }
                        className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-hidden transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                      >
                        {portofolioAppSourceTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeAppsSource(index)}
                        className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Images"
              subtitle="Upload gallery images and remove any items you no longer want attached."
            >
              <div className="flex flex-col gap-4">
                <FileUploadField
                  label="Add image"
                  value={formState.images.at(-1)?.image_path}
                  isUploading={isUploadingImage}
                  onUpload={uploadImage}
                />

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {formState.images.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-8 text-sm text-slate-400 sm:col-span-2 xl:col-span-3">
                      No gallery images yet.
                    </div>
                  ) : (
                    formState.images.map((image, index) => (
                      <div
                        key={`${image.id || "new"}-${index}`}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60"
                      >
                        <div className="flex h-40 items-center justify-center bg-slate-900/50">
                          {image.image_url ? (
                            <DefaultImage
                              src={image.image_url}
                              alt={`portfolio image ${index + 1}`}
                              className="h-full w-full"
                              sizes="320px"
                            />
                          ) : (
                            <div className="px-4 text-center text-sm text-slate-300">
                              {image.image_path}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                          <p className="truncate text-xs text-slate-400">
                            {image.image_path}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="rounded-full border border-rose-300/30 bg-rose-400/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/20"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <SectionCard
              title="Categories"
              subtitle="Select every category that belongs to this portfolio."
            >
              <div className="max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {categories.map((category) => {
                    const checked = formState.category_ids.includes(
                      category.id ?? "",
                    );
                    return (
                      <label
                        key={category.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                          checked
                            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                            : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(category.id ?? "")}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-300/20"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {category.title}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-400">
                            {category.description ?? "-"}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Frameworks"
              subtitle="Pick the frameworks used in this portfolio."
            >
              <div className="max-h-[420px] overflow-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  {frameworks.map((framework) => {
                    const checked = formState.framework_ids.includes(
                      framework.id ?? "",
                    );
                    return (
                      <label
                        key={framework.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                          checked
                            ? "border-cyan-300/40 bg-cyan-400/10 text-cyan-100"
                            : "border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFramework(framework.id ?? "")}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-cyan-400 focus:ring-cyan-300/20"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">
                            {framework.title}
                          </p>
                          <p className="mt-1 break-all text-xs text-slate-400">
                            {framework.description ?? "-"}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Summary"
              subtitle="A quick overview of the current payload."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Sources
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {formState.apps_sources.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Images
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {formState.images.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Categories
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {formState.category_ids.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Frameworks
                  </p>
                  <p className="mt-2 text-sm text-white">
                    {formState.framework_ids.length}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
