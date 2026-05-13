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
import { GeneralService } from "@/features/core/application/general_service";
import { CreateGeneralRequest } from "@/features/core/domain/model/request/general/create_general_request";
import { GeneralResponse } from "@/features/core/domain/model/response/general_response";
import { uploadFileWithSignature } from "@/shared/utils/utility/minio_upload";

interface GeneralFormState extends CreateGeneralRequest {
  cv_file?: File | null;
}

interface GeneralContextProps {
  generals: GeneralResponse.Data[];
  selectedGeneral: GeneralResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: GeneralFormState;
  openCreateForm: () => void;
  openViewModal: (item: GeneralResponse.Data) => void;
  openEditForm: (item: GeneralResponse.Data) => void;
  openDeleteDialog: (item: GeneralResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof GeneralFormState, value: string) => void;
  uploadCvFile: (file: File) => Promise<void>;
  saveGeneral: () => Promise<void>;
  deleteGeneral: () => Promise<void>;
  refreshGenerals: () => Promise<void>;
}

const defaultFormState: GeneralFormState = {
  title: "",
  description: "",
  email: "",
  github_url: "",
  gitlab_url: "",
  linkedin_url: "",
  thread_url: "",
  tiktok_url: "",
  cv_path: "",
  cv_file: null,
};

const GeneralLogic = createContext<GeneralContextProps | undefined>(undefined);

export const GeneralProvider = ({ children }: { children: React.ReactNode }) => {
  const service = useMemo(() => new GeneralService(), []);
  const { setLoading } = useLoading();
  const [generals, setGenerals] = useState<GeneralResponse.Data[]>([]);
  const [selectedGeneral, setSelectedGeneral] =
    useState<GeneralResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<GeneralFormState>(defaultFormState);
  const didFetchInitialData = useRef(false);

  const refreshGenerals = useCallback(async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      const result = await service.fetchGenerals();
      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to load general data");
        },
        (data) => {
          setGenerals(data);
        },
      );
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [service, setLoading]);

  useEffect(() => {
    if (didFetchInitialData.current) return;
    didFetchInitialData.current = true;
    void refreshGenerals();
  }, [refreshGenerals]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedGeneral(null);
    setIsEditing(false);
    setFormState(defaultFormState);
  }, []);

  const openCreateForm = useCallback(() => {
    setSelectedGeneral(null);
    setIsEditing(false);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  }, []);

  const openViewModal = useCallback((item: GeneralResponse.Data) => {
    setSelectedGeneral(item);
    setIsDetailOpen(true);
  }, []);

  const openEditForm = useCallback((item: GeneralResponse.Data) => {
    setSelectedGeneral(item);
    setIsEditing(true);
    setFormState({
      title: item.title ?? "",
      description: item.description ?? "",
      email: item.email ?? "",
      github_url: item.github_url ?? "",
      gitlab_url: item.gitlab_url ?? "",
      linkedin_url: item.linkedin_url ?? "",
      thread_url: item.thread_url ?? "",
      tiktok_url: item.tiktok_url ?? "",
      cv_path: item.cv_path ?? "",
      cv_file: null,
    });
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((item: GeneralResponse.Data) => {
    setSelectedGeneral(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback(
    (field: keyof GeneralFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const uploadCvFile = useCallback(async (file: File) => {
    if (file.type && file.type !== "application/pdf") {
      toast.error("CV file must be a PDF");
      return;
    }
    setFormState((prev) => ({ ...prev, cv_file: file }));
    toast.success("CV selected. It will upload when you save.");
  }, []);

  const saveGeneral = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreateGeneralRequest = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        email: formState.email.trim(),
        github_url: formState.github_url.trim(),
        gitlab_url: formState.gitlab_url.trim(),
        linkedin_url: formState.linkedin_url.trim(),
        thread_url: formState.thread_url.trim(),
        tiktok_url: formState.tiktok_url.trim(),
        cv_path: formState.cv_path?.trim() || null,
      };

      const requiredPayload = {
        title: payload.title,
        description: payload.description,
        email: payload.email,
        github_url: payload.github_url,
        gitlab_url: payload.gitlab_url,
        linkedin_url: payload.linkedin_url,
        thread_url: payload.thread_url,
        tiktok_url: payload.tiktok_url,
      };
      const missingField = Object.entries(requiredPayload).find(
        ([, value]) => !value,
      )?.[0];
      if (missingField) {
        toast.error("All general fields are required");
        return;
      }

      if (formState.cv_file) {
        setIsUploading(true);
        try {
          payload.cv_path = await uploadFileWithSignature(
            formState.cv_file,
            service.createUploadSignature.bind(service),
          );
        } finally {
          setIsUploading(false);
        }
      }

      const result =
        isEditing && selectedGeneral?.id
          ? await service.updateGeneral(selectedGeneral.id, payload)
          : await service.createGeneral(payload);

      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to save general data");
        },
        async () => {
          toast.success(isEditing ? "General updated" : "General created");
          closeModal();
          await refreshGenerals();
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    formState.description,
    formState.email,
    formState.github_url,
    formState.gitlab_url,
    formState.linkedin_url,
    formState.thread_url,
    formState.tiktok_url,
    formState.title,
    formState.cv_file,
    formState.cv_path,
    isEditing,
    refreshGenerals,
    selectedGeneral?.id,
    service,
    setLoading,
  ]);

  const deleteGeneral = useCallback(async () => {
    if (!selectedGeneral?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deleteGeneral(selectedGeneral.id);
      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to delete general data");
        },
        async () => {
          toast.success("General deleted");
          closeModal();
          await refreshGenerals();
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [closeModal, refreshGenerals, selectedGeneral?.id, service, setLoading]);

  const value: GeneralContextProps = {
    generals,
    selectedGeneral,
    isLoading,
    isSubmitting,
    isUploading,
    isDetailOpen,
    isFormOpen,
    isDeleteOpen,
    isEditing,
    formState,
    openCreateForm,
    openViewModal,
    openEditForm,
    openDeleteDialog,
    closeModal,
    setFormField,
    uploadCvFile,
    saveGeneral,
    deleteGeneral,
    refreshGenerals,
  };

  return <GeneralLogic.Provider value={value}>{children}</GeneralLogic.Provider>;
};

export const useGeneralLogic = () => {
  const context = useContext(GeneralLogic);
  if (!context) {
    throw new Error("useGeneralLogic must be used within GeneralProvider");
  }
  return context;
};
