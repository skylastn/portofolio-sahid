"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useLoading } from "@/shared/component/elements/loading_context";
import { EitherType } from "@/shared/utils/utility/either";
import { buildUploadFileName, uploadFileToPresignedUrl } from "@/shared/utils/utility/minio_upload";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { WorkService } from "@/features/core/application/work_service";
import { CategoryService } from "@/features/core/application/category_service";
import { FrameworkService } from "@/features/core/application/framework_service";
import { CreatePortofolioRequest } from "@/features/core/domain/model/request/portofolio/create_portofolio_request";
import {
  CreatePortofolioAppsSourceRequest,
  PortofolioAppsSourceType,
} from "@/features/core/domain/model/request/portofolio/create_portofolio_apps_source_request";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { CategoryResponse } from "@/features/core/domain/model/response/category_response";
import { FrameworkResponse } from "@/features/core/domain/model/response/framework_response";

type PortofolioFormMode = "create" | "edit";

interface PortofolioFormImage {
  id: string;
  image_path: string;
  image_url?: string | null;
}

interface PortofolioAppsSourceForm extends CreatePortofolioAppsSourceRequest {
  id: string;
}

interface PortofolioFormState {
  work_id: string;
  title: string;
  description: string;
  thumbnail_path: string;
  apps_sources: PortofolioAppsSourceForm[];
  images: PortofolioFormImage[];
  category_ids: string[];
  framework_ids: string[];
  deleted_apps_source_ids: string[];
  deleted_image_ids: string[];
  deleted_category_ids: string[];
  deleted_framework_ids: string[];
}

interface PortofolioFormContextProps {
  mode: PortofolioFormMode;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploadingThumbnail: boolean;
  isUploadingImage: boolean;
  portfolio: PortofolioResponse.Data | null;
  works: WorkResponse.Data[];
  categories: CategoryResponse.Data[];
  frameworks: FrameworkResponse.Data[];
  formState: PortofolioFormState;
  openBack: () => void;
  setFormField: (field: "work_id" | "title" | "description" | "thumbnail_path", value: string) => void;
  addAppsSource: () => void;
  updateAppsSource: (index: number, field: "url" | "type", value: string) => void;
  removeAppsSource: (index: number) => void;
  toggleCategory: (categoryId: string) => void;
  toggleFramework: (frameworkId: string) => void;
  removeImage: (index: number) => void;
  uploadThumbnail: (file: File) => Promise<void>;
  uploadImage: (file: File) => Promise<void>;
  savePortofolio: () => Promise<void>;
}

const defaultAppsSource = (): PortofolioAppsSourceForm => ({
  id: "",
  url: "",
  type: "web",
});

const defaultFormState = (): PortofolioFormState => ({
  work_id: "",
  title: "",
  description: "",
  thumbnail_path: "",
  apps_sources: [defaultAppsSource()],
  images: [],
  category_ids: [],
  framework_ids: [],
  deleted_apps_source_ids: [],
  deleted_image_ids: [],
  deleted_category_ids: [],
  deleted_framework_ids: [],
});

const PortofolioFormContext = createContext<PortofolioFormContextProps | undefined>(undefined);

export const portofolioAppSourceTypes: PortofolioAppsSourceType[] = [
  "web",
  "android",
  "ios",
  "windows",
  "mac",
  "linux",
  "github",
  "other",
];

const uniqueStrings = (items: string[]) => Array.from(new Set(items.filter(Boolean)));

export const PortofolioFormProvider = ({
  children,
  mode,
  portofolioId,
}: {
  children: React.ReactNode;
  mode: PortofolioFormMode;
  portofolioId?: string;
}) => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const service = useMemo(() => new PortofolioService(), []);
  const workService = useMemo(() => new WorkService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);
  const frameworkService = useMemo(() => new FrameworkService(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [portfolio, setPortfolio] = useState<PortofolioResponse.Data | null>(null);
  const [works, setWorks] = useState<WorkResponse.Data[]>([]);
  const [categories, setCategories] = useState<CategoryResponse.Data[]>([]);
  const [frameworks, setFrameworks] = useState<FrameworkResponse.Data[]>([]);
  const [formState, setFormState] = useState<PortofolioFormState>(defaultFormState());
  const categoryMappingIdsRef = useRef<Record<string, string>>({});
  const frameworkMappingIdsRef = useRef<Record<string, string>>({});
  const didLoadRef = useRef(false);

  const openBack = useCallback(() => {
    void router.push("/admin/portofolio");
  }, [router]);

  const loadOptions = useCallback(async () => {
    const [worksResult, categoriesResult, frameworksResult] = await Promise.all([
      workService.fetchWorks({ page: 1, perPage: 100 }),
      categoryService.fetchCategories({ page: 1, perPage: 100 }),
      frameworkService.fetchFrameworks({ page: 1, perPage: 100 }),
    ]);

    worksResult.fold(
      (err) => toast.error(err.message ?? "Failed to load works"),
      (response) => setWorks(response.data ?? []),
    );
    categoriesResult.fold(
      (err) => toast.error(err.message ?? "Failed to load categories"),
      (response) => setCategories(response.data ?? []),
    );
    frameworksResult.fold(
      (err) => toast.error(err.message ?? "Failed to load frameworks"),
      (response) => setFrameworks(response.data ?? []),
    );
  }, [categoryService, frameworkService, workService]);

  const normalizeFromPortfolio = useCallback((item: PortofolioResponse.Data) => {
    const categoryIds = item.category_mappings?.map((mapping) => mapping.category_id ?? "").filter(Boolean) ?? [];
    const frameworkIds = item.framework_mappings?.map((mapping) => mapping.framework_id ?? "").filter(Boolean) ?? [];

    categoryMappingIdsRef.current = Object.fromEntries(
      (item.category_mappings ?? [])
        .filter((mapping) => Boolean(mapping.category_id) && Boolean(mapping.id))
        .map((mapping) => [mapping.category_id as string, mapping.id as string]),
    );

    frameworkMappingIdsRef.current = Object.fromEntries(
      (item.framework_mappings ?? [])
        .filter((mapping) => Boolean(mapping.framework_id) && Boolean(mapping.id))
        .map((mapping) => [mapping.framework_id as string, mapping.id as string]),
    );

    setFormState({
      work_id: item.work_id ?? "",
      title: item.title ?? "",
      description: item.description ?? "",
      thumbnail_path: item.thumbnail_path ?? "",
      apps_sources:
        (item.apps_sources ?? []).length > 0
          ? (item.apps_sources ?? []).map((source) => ({
              id: source.id ?? "",
              url: source.url ?? "",
              type: (source.type as PortofolioAppsSourceType) ?? "web",
            }))
          : [defaultAppsSource()],
      images:
        (item.images ?? []).length > 0
          ? (item.images ?? []).map((image) => ({
              id: image.id ?? "",
              image_path: image.image_path ?? "",
              image_url: image.image_url ?? null,
            }))
          : [],
      category_ids: uniqueStrings(categoryIds),
      framework_ids: uniqueStrings(frameworkIds),
      deleted_apps_source_ids: [],
      deleted_image_ids: [],
      deleted_category_ids: [],
      deleted_framework_ids: [],
    });
  }, []);

  const loadPortfolio = useCallback(async () => {
    if (mode !== "edit" || !portofolioId) return;
    const result = await service.fetchPortofolioById(portofolioId);
    result.fold(
      (err) => {
        toast.error(err.message ?? "Failed to load portfolio");
        openBack();
      },
      (response) => {
        setPortfolio(response);
        normalizeFromPortfolio(response);
      },
    );
  }, [mode, normalizeFromPortfolio, openBack, portofolioId, service]);

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;

    const run = async () => {
      setLoading(true);
      setIsLoading(true);
      try {
        await loadOptions();
        await loadPortfolio();
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };

    void run();
  }, [loadOptions, loadPortfolio, setLoading]);

  const setFormField = useCallback(
    (field: "work_id" | "title" | "description" | "thumbnail_path", value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addAppsSource = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      apps_sources: [...prev.apps_sources, defaultAppsSource()],
    }));
  }, []);

  const updateAppsSource = useCallback(
    (index: number, field: "url" | "type", value: string) => {
      setFormState((prev) => ({
        ...prev,
        apps_sources: prev.apps_sources.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [],
  );

  const removeAppsSource = useCallback((index: number) => {
    setFormState((prev) => {
      const item = prev.apps_sources[index];
      return {
        ...prev,
        apps_sources: prev.apps_sources.filter((_, itemIndex) => itemIndex !== index),
        deleted_apps_source_ids: item?.id
          ? uniqueStrings([...prev.deleted_apps_source_ids, item.id])
          : prev.deleted_apps_source_ids,
      };
    });
  }, []);

  const toggleCategory = useCallback((categoryId: string) => {
    setFormState((prev) => {
      const exists = prev.category_ids.includes(categoryId);
      const mappingId = categoryMappingIdsRef.current[categoryId];
      if (exists) {
        return {
          ...prev,
          category_ids: prev.category_ids.filter((id) => id !== categoryId),
          deleted_category_ids: mappingId
            ? uniqueStrings([...prev.deleted_category_ids, mappingId])
            : prev.deleted_category_ids,
        };
      }
      return {
        ...prev,
        category_ids: uniqueStrings([...prev.category_ids, categoryId]),
        deleted_category_ids: mappingId
          ? prev.deleted_category_ids.filter((id) => id !== mappingId)
          : prev.deleted_category_ids,
      };
    });
  }, []);

  const toggleFramework = useCallback((frameworkId: string) => {
    setFormState((prev) => {
      const exists = prev.framework_ids.includes(frameworkId);
      const mappingId = frameworkMappingIdsRef.current[frameworkId];
      if (exists) {
        return {
          ...prev,
          framework_ids: prev.framework_ids.filter((id) => id !== frameworkId),
          deleted_framework_ids: mappingId
            ? uniqueStrings([...prev.deleted_framework_ids, mappingId])
            : prev.deleted_framework_ids,
        };
      }
      return {
        ...prev,
        framework_ids: uniqueStrings([...prev.framework_ids, frameworkId]),
        deleted_framework_ids: mappingId
          ? prev.deleted_framework_ids.filter((id) => id !== mappingId)
          : prev.deleted_framework_ids,
      };
    });
  }, []);

  const removeImage = useCallback((index: number) => {
    setFormState((prev) => {
      const item = prev.images[index];
      return {
        ...prev,
        images: prev.images.filter((_, itemIndex) => itemIndex !== index),
        deleted_image_ids: item?.id
          ? uniqueStrings([...prev.deleted_image_ids, item.id])
          : prev.deleted_image_ids,
      };
    });
  }, []);

  const uploadThumbnail = useCallback(
    async (file: File) => {
      setIsUploadingThumbnail(true);
      setLoading(true);
      try {
        const signatureResult = await service.createUploadSignature(buildUploadFileName(file));
        if (signatureResult.tag === EitherType.Left) {
          toast.error(signatureResult.left.message ?? "Failed to create upload signature");
          return;
        }
        await uploadFileToPresignedUrl(signatureResult.right.url, file);
        setFormState((prev) => ({ ...prev, thumbnail_path: signatureResult.right.key }));
        toast.success("Thumbnail uploaded");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to upload image");
      } finally {
        setIsUploadingThumbnail(false);
        setLoading(false);
      }
    },
    [service, setLoading],
  );

  const uploadImage = useCallback(
    async (file: File) => {
      setIsUploadingImage(true);
      setLoading(true);
      try {
        const signatureResult = await service.createImageUploadSignature(buildUploadFileName(file));
        if (signatureResult.tag === EitherType.Left) {
          toast.error(signatureResult.left.message ?? "Failed to create upload signature");
          return;
        }
        await uploadFileToPresignedUrl(signatureResult.right.url, file);
        setFormState((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            {
              id: "",
              image_path: signatureResult.right.key,
              image_url: null,
            },
          ],
        }));
        toast.success("Image uploaded");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to upload image");
      } finally {
        setIsUploadingImage(false);
        setLoading(false);
      }
    },
    [service, setLoading],
  );

  const savePortofolio = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreatePortofolioRequest = {
        work_id: formState.work_id?.trim() || null,
        title: formState.title.trim(),
        description: formState.description.trim(),
        thumbnail_path: formState.thumbnail_path?.trim() || null,
        apps_sources: formState.apps_sources
          .filter((item) => item.url.trim())
          .map((item) => ({
            id: item.id?.trim() || null,
            url: item.url.trim(),
            type: item.type,
          })),
        deleted_apps_source_ids: uniqueStrings(formState.deleted_apps_source_ids),
        images: formState.images.map((item) => item.image_path).filter(Boolean),
        deleted_image_ids: uniqueStrings(formState.deleted_image_ids),
        category_ids: uniqueStrings(formState.category_ids),
        deleted_category_ids: uniqueStrings(formState.deleted_category_ids),
        framework_ids: uniqueStrings(formState.framework_ids),
        deleted_framework_ids: uniqueStrings(formState.deleted_framework_ids),
      };

      if (!payload.title || !payload.description) {
        toast.error("Title and description are required");
        return;
      }

      if (mode === "edit" && portofolioId) {
        const result = await service.updatePortofolio(portofolioId, payload);
        result.fold(
          (err) => toast.error(err.message ?? "Failed to update portfolio"),
          async () => {
            toast.success("Portfolio updated");
            openBack();
          },
        );
      } else {
        const result = await service.createPortofolio(payload);
        result.fold(
          (err) => toast.error(err.message ?? "Failed to create portfolio"),
          async () => {
            toast.success("Portfolio created");
            openBack();
          },
        );
      }
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [formState, mode, openBack, portofolioId, service, setLoading]);

  return (
    <PortofolioFormContext.Provider
      value={{
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
      }}
    >
      {children}
    </PortofolioFormContext.Provider>
  );
};

export const usePortofolioFormLogic = () => {
  const context = useContext(PortofolioFormContext);
  if (!context) {
    throw new Error("usePortofolioFormLogic must be used within PortofolioFormProvider");
  }
  return context;
};
