"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useLoading } from "@/shared/component/elements/loading_context";
import { CodeLanguageService } from "@/features/core/application/code_language_service";
import { FrameworkService } from "@/features/core/application/framework_service";
import { CodeLanguageResponse } from "@/features/core/domain/model/response/code_language_response";
import { CreateFrameworkRequest } from "@/features/core/domain/model/request/framework/create_framework_request";
import { FrameworkRequest } from "@/features/core/domain/model/request/framework/framework_request";
import { FrameworkResponse } from "@/features/core/domain/model/response/framework_response";
import { EitherType } from "@/shared/utils/utility/either";
import {
  buildUploadFileName,
  uploadFileToPresignedUrl,
} from "@/shared/utils/utility/minio_upload";

interface FrameworkFormState extends CreateFrameworkRequest {}

interface FrameworkContextProps {
  frameworks: FrameworkResponse.Data[];
  codeLanguages: CodeLanguageResponse.Data[];
  selectedFramework: FrameworkResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: FrameworkFormState;
  currentPage: number;
  perPage: number;
  total: number;
  openCreateForm: () => void;
  openViewModal: (item: FrameworkResponse.Data) => Promise<void>;
  openEditForm: (item: FrameworkResponse.Data) => Promise<void>;
  openDeleteDialog: (item: FrameworkResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof FrameworkFormState, value: string) => void;
  toggleCodeLanguageMapping: (id: string) => void;
  saveFramework: () => Promise<void>;
  deleteFramework: () => Promise<void>;
  uploadFrameworkImage: (file: File) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const defaultFormState: FrameworkFormState = {
  code_language_id: "",
  title: "",
  description: "",
  image_path: "",
  code_language_ids: [],
  deleted_code_language_ids: [],
  position: 0,
};

const FrameworkLogic = createContext<FrameworkContextProps | undefined>(
  undefined,
);

export const FrameworkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const service = useMemo(() => new FrameworkService(), []);
  const codeLanguageService = useMemo(() => new CodeLanguageService(), []);
  const { setLoading } = useLoading();
  const [frameworks, setFrameworks] = useState<FrameworkResponse.Data[]>([]);
  const [codeLanguages, setCodeLanguages] = useState<
    CodeLanguageResponse.Data[]
  >([]);
  const [selectedFramework, setSelectedFramework] =
    useState<FrameworkResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] =
    useState<FrameworkFormState>(defaultFormState);
  const [initialCodeLanguageIds, setInitialCodeLanguageIds] = useState<
    string[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const refreshFrameworks = useCallback(
    async (page = 1) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const query: FrameworkRequest = { page, perPage };
        const result = await service.fetchFrameworks(query);
        result.fold(
          (err) => toast.error(err.message ?? "Failed to load framework data"),
          (response) => {
            setFrameworks(response.data ?? []);
            setTotal(response.total ?? 0);
            setCurrentPage(response.currentPage ?? page);
          },
        );
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    },
    [perPage, service, setLoading],
  );

  const refreshCodeLanguages = useCallback(async () => {
    const result = await codeLanguageService.fetchCodeLanguages({
      page: 1,
      perPage: 1000,
    });
    result.fold(
      () => {},
      (response) => setCodeLanguages(response.data ?? []),
    );
  }, [codeLanguageService]);

  useEffect(() => {
    if (didFetchInitialData.current) return;
    didFetchInitialData.current = true;
    void refreshFrameworks(1);
    void refreshCodeLanguages();
  }, [refreshCodeLanguages, refreshFrameworks]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedFramework(null);
    setIsEditing(false);
    setFormState(defaultFormState);
    setInitialCodeLanguageIds([]);
  }, []);

  const openCreateForm = useCallback(() => {
    setSelectedFramework(null);
    setIsEditing(false);
    setFormState(defaultFormState);
    setInitialCodeLanguageIds([]);
    setIsFormOpen(true);
  }, []);

  const fetchFrameworkDetail = useCallback(
    async (item: FrameworkResponse.Data) => {
      if (!item.id) return item;
      const result = await service.fetchFrameworkById(item.id);
      if (result.tag === EitherType.Left) {
        toast.error(result.left.message ?? "Failed to load framework detail");
        return item;
      }
      return result.right;
    },
    [service],
  );

  const getMappedCodeLanguageIds = useCallback(
    (item: FrameworkResponse.Data) =>
      (item.code_language_mappings ?? [])
        .map((mapping) => mapping.code_language_id)
        .filter((id): id is string => !!id),
    [],
  );

  const openViewModal = useCallback(
    async (item: FrameworkResponse.Data) => {
      setLoading(true);
      try {
        const detail = await fetchFrameworkDetail(item);
        setSelectedFramework(detail);
        setIsDetailOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [fetchFrameworkDetail, setLoading],
  );

  const openEditForm = useCallback(
    async (item: FrameworkResponse.Data) => {
      setLoading(true);
      try {
        const detail = await fetchFrameworkDetail(item);
        const mappedCodeLanguageIds = getMappedCodeLanguageIds(detail);
        setSelectedFramework(detail);
        setInitialCodeLanguageIds(mappedCodeLanguageIds);
        setIsEditing(true);
        setFormState({
          code_language_id: detail.code_language_id ?? "",
          title: detail.title ?? "",
          description: detail.description ?? "",
          image_path: detail.image_path ?? "",
          code_language_ids: mappedCodeLanguageIds,
          deleted_code_language_ids: [],
          position: detail.position ?? 0,
        });
        setIsFormOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [fetchFrameworkDetail, getMappedCodeLanguageIds, setLoading],
  );

  const openDeleteDialog = useCallback((item: FrameworkResponse.Data) => {
    setSelectedFramework(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback(
    (field: keyof FrameworkFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const toggleCodeLanguageMapping = useCallback((id: string) => {
    setFormState((prev) => {
      const currentIds = prev.code_language_ids ?? [];
      const nextIds = currentIds.includes(id)
        ? currentIds.filter((item) => item !== id)
        : [...currentIds, id];

      return {
        ...prev,
        code_language_ids: nextIds,
      };
    });
  }, []);

  const uploadFrameworkImage = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setLoading(true);
      try {
        const signatureResult = await service.createUploadSignature(
          buildUploadFileName(file),
        );
        if (signatureResult.tag === EitherType.Left) {
          toast.error(
            signatureResult.left.message ?? "Failed to create upload signature",
          );
          return;
        }
        const signature = signatureResult.right;

        await uploadFileToPresignedUrl(signature.url, file);
        setFormState((prev) => ({ ...prev, image_path: signature.key }));
        toast.success("Image uploaded");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      } finally {
        setIsUploading(false);
        setLoading(false);
      }
    },
    [service, setLoading],
  );

  const saveFramework = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreateFrameworkRequest = {
        code_language_id: formState.code_language_id.trim(),
        title: formState.title.trim(),
        description: formState.description.trim(),
        image_path: formState.image_path?.trim() || null,
        code_language_ids: formState.code_language_ids ?? [],
        deleted_code_language_ids: initialCodeLanguageIds.filter(
          (id) => !(formState.code_language_ids ?? []).includes(id),
        ),
        position: Number(formState.position ?? 0),
      };

      if (!payload.code_language_id || !payload.title || !payload.description) {
        toast.error("Code language, title, and description are required");
        return;
      }

      const result =
        isEditing && selectedFramework?.id
          ? await service.updateFramework(selectedFramework.id, payload)
          : await service.createFramework(payload);

      result.fold(
        (err) => toast.error(err.message ?? "Failed to save framework data"),
        async () => {
          toast.success(isEditing ? "Framework updated" : "Framework created");
          closeModal();
          await refreshFrameworks(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    formState.code_language_id,
    formState.description,
    formState.image_path,
    formState.title,
    formState.code_language_ids,
    formState.position,
    initialCodeLanguageIds,
    isEditing,
    refreshFrameworks,
    selectedFramework?.id,
    service,
    setLoading,
  ]);

  const deleteFramework = useCallback(async () => {
    if (!selectedFramework?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deleteFramework(selectedFramework.id);
      result.fold(
        (err) => toast.error(err.message ?? "Failed to delete framework data"),
        async () => {
          toast.success("Framework deleted");
          closeModal();
          await refreshFrameworks(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    refreshFrameworks,
    selectedFramework?.id,
    service,
    setLoading,
  ]);

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1) return;
      await refreshFrameworks(page);
    },
    [refreshFrameworks],
  );

  return (
    <FrameworkLogic.Provider
      value={{
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
      }}
    >
      {children}
    </FrameworkLogic.Provider>
  );
};

export const useFrameworkLogic = () => {
  const context = useContext(FrameworkLogic);
  if (!context) {
    throw new Error("useFrameworkLogic must be used within FrameworkProvider");
  }
  return context;
};
