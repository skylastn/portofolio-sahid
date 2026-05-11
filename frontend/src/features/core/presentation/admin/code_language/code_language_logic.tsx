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
import { CodeLanguageRequest } from "@/features/core/domain/model/request/code_language/code_language_request";
import { CreateCodeLanguageRequest } from "@/features/core/domain/model/request/code_language/create_code_language_request";
import { CodeLanguageResponse } from "@/features/core/domain/model/response/code_language_response";
import { uploadFileWithSignature } from "@/shared/utils/utility/minio_upload";

interface CodeLanguageFormState extends CreateCodeLanguageRequest {
  image_file?: File | null;
}

interface CodeLanguageContextProps {
  codeLanguages: CodeLanguageResponse.Data[];
  selectedCodeLanguage: CodeLanguageResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: CodeLanguageFormState;
  currentPage: number;
  perPage: number;
  total: number;
  openCreateForm: () => void;
  openViewModal: (item: CodeLanguageResponse.Data) => void;
  openEditForm: (item: CodeLanguageResponse.Data) => void;
  openDeleteDialog: (item: CodeLanguageResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof CodeLanguageFormState, value: string) => void;
  saveCodeLanguage: () => Promise<void>;
  deleteCodeLanguage: () => Promise<void>;
  uploadCodeLanguageImage: (file: File) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const defaultFormState: CodeLanguageFormState = {
  title: "",
  description: "",
  image_path: "",
  image_file: null,
  position: 0,
};

const CodeLanguageLogic = createContext<CodeLanguageContextProps | undefined>(
  undefined,
);

export const CodeLanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const service = useMemo(() => new CodeLanguageService(), []);
  const { setLoading } = useLoading();
  const [codeLanguages, setCodeLanguages] = useState<
    CodeLanguageResponse.Data[]
  >([]);
  const [selectedCodeLanguage, setSelectedCodeLanguage] =
    useState<CodeLanguageResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] =
    useState<CodeLanguageFormState>(defaultFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const refreshCodeLanguages = useCallback(
    async (page = 1) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const query: CodeLanguageRequest = { page, perPage };
        const result = await service.fetchCodeLanguages(query);
        result.fold(
          (err) =>
            toast.error(err.message ?? "Failed to load code language data"),
          (response) => {
            setCodeLanguages(response.data ?? []);
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

  useEffect(() => {
    if (didFetchInitialData.current) return;
    didFetchInitialData.current = true;
    void refreshCodeLanguages(1);
  }, [refreshCodeLanguages]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedCodeLanguage(null);
    setIsEditing(false);
    setFormState(defaultFormState);
  }, []);

  const openCreateForm = useCallback(() => {
    setSelectedCodeLanguage(null);
    setIsEditing(false);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  }, []);

  const openViewModal = useCallback((item: CodeLanguageResponse.Data) => {
    setSelectedCodeLanguage(item);
    setIsDetailOpen(true);
  }, []);

  const openEditForm = useCallback((item: CodeLanguageResponse.Data) => {
    setSelectedCodeLanguage(item);
    setIsEditing(true);
    setFormState({
      title: item.title ?? "",
      description: item.description ?? "",
      image_path: item.image_path ?? "",
      image_file: null,
      position: item.position ?? 0,
    });
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((item: CodeLanguageResponse.Data) => {
    setSelectedCodeLanguage(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback(
    (field: keyof CodeLanguageFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const uploadCodeLanguageImage = useCallback(
    async (file: File) => {
      setFormState((prev) => ({ ...prev, image_file: file }));
      toast.success("Image selected. It will upload when you save.");
    },
    [],
  );

  const saveCodeLanguage = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const imagePath = formState.image_file
        ? await uploadFileWithSignature(
            formState.image_file,
            service.createUploadSignature.bind(service),
          )
        : formState.image_path?.trim() || null;

      const payload: CreateCodeLanguageRequest = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        image_path: imagePath,
        position: Number(formState.position ?? 0),
      };

      if (!payload.title || !payload.description) {
        toast.error("Title and description are required");
        return;
      }

      const result =
        isEditing && selectedCodeLanguage?.id
          ? await service.updateCodeLanguage(selectedCodeLanguage.id, payload)
          : await service.createCodeLanguage(payload);

      result.fold(
        (err) =>
          toast.error(err.message ?? "Failed to save code language data"),
        async () => {
          toast.success(
            isEditing ? "Code language updated" : "Code language created",
          );
          closeModal();
          await refreshCodeLanguages(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    formState.description,
    formState.image_path,
    formState.image_file,
    formState.position,
    formState.title,
    isEditing,
    refreshCodeLanguages,
    selectedCodeLanguage?.id,
    service,
    setLoading,
  ]);

  const deleteCodeLanguage = useCallback(async () => {
    if (!selectedCodeLanguage?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deleteCodeLanguage(selectedCodeLanguage.id);
      result.fold(
        (err) =>
          toast.error(err.message ?? "Failed to delete code language data"),
        async () => {
          toast.success("Code language deleted");
          closeModal();
          await refreshCodeLanguages(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    refreshCodeLanguages,
    selectedCodeLanguage?.id,
    service,
    setLoading,
  ]);

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1) return;
      await refreshCodeLanguages(page);
    },
    [refreshCodeLanguages],
  );

  return (
    <CodeLanguageLogic.Provider
      value={{
        codeLanguages,
        selectedCodeLanguage,
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
        saveCodeLanguage,
        deleteCodeLanguage,
        uploadCodeLanguageImage,
        goToPage,
      }}
    >
      {children}
    </CodeLanguageLogic.Provider>
  );
};

export const useCodeLanguageLogic = () => {
  const context = useContext(CodeLanguageLogic);
  if (!context) {
    throw new Error(
      "useCodeLanguageLogic must be used within CodeLanguageProvider",
    );
  }
  return context;
};
