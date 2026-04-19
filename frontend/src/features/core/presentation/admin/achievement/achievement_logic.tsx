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
import { AchievementService } from "@/features/core/application/achievement_service";
import { AchievementRequest } from "@/features/core/domain/model/request/achievement/achievement_request";
import { CreateAchievementRequest } from "@/features/core/domain/model/request/achievement/create_achievement_request";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { EitherType } from "@/shared/utils/utility/either";
import {
  buildUploadFileName,
  uploadFileToPresignedUrl,
} from "@/shared/utils/utility/minio_upload";

interface AchievementFormState extends CreateAchievementRequest {}

interface AchievementContextProps {
  achievements: AchievementResponse.Data[];
  selectedAchievement: AchievementResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: AchievementFormState;
  currentPage: number;
  perPage: number;
  total: number;
  openCreateForm: () => void;
  openViewModal: (item: AchievementResponse.Data) => void;
  openEditForm: (item: AchievementResponse.Data) => void;
  openDeleteDialog: (item: AchievementResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof AchievementFormState, value: string) => void;
  saveAchievement: () => Promise<void>;
  deleteAchievement: () => Promise<void>;
  uploadAchievementImage: (file: File) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const defaultFormState: AchievementFormState = {
  title: "",
  description: "",
  date: "",
  image_path: "",
};

const AchievementLogic = createContext<AchievementContextProps | undefined>(
  undefined,
);

export const AchievementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const service = useMemo(() => new AchievementService(), []);
  const { setLoading } = useLoading();
  const [achievements, setAchievements] = useState<AchievementResponse.Data[]>([]);
  const [selectedAchievement, setSelectedAchievement] =
    useState<AchievementResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<AchievementFormState>(defaultFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const refreshAchievements = useCallback(
    async (page = 1) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const query: AchievementRequest = { page, perPage };
        const result = await service.fetchAchievements(query);
        result.fold(
          (err) => {
            toast.error(err.message ?? "Failed to load achievement data");
          },
          (response) => {
            setAchievements(response.data ?? []);
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
    void refreshAchievements(1);
  }, [refreshAchievements]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedAchievement(null);
    setIsEditing(false);
    setFormState(defaultFormState);
  }, []);

  const openCreateForm = useCallback(() => {
    setSelectedAchievement(null);
    setIsEditing(false);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  }, []);

  const openViewModal = useCallback((item: AchievementResponse.Data) => {
    setSelectedAchievement(item);
    setIsDetailOpen(true);
  }, []);

  const openEditForm = useCallback((item: AchievementResponse.Data) => {
    setSelectedAchievement(item);
    setIsEditing(true);
    setFormState({
      title: item.title ?? "",
      description: item.description ?? "",
      date: item.date ? String(item.date).slice(0, 10) : "",
      image_path: item.image_path ?? "",
    });
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((item: AchievementResponse.Data) => {
    setSelectedAchievement(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback(
    (field: keyof AchievementFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const uploadAchievementImage = useCallback(
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

  const saveAchievement = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreateAchievementRequest = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        date: formState.date.trim(),
        image_path: formState.image_path?.trim() || null,
      };

      if (!payload.title || !payload.description || !payload.date) {
        toast.error("Title, description, and date are required");
        return;
      }

      const result =
        isEditing && selectedAchievement?.id
          ? await service.updateAchievement(selectedAchievement.id, payload)
          : await service.createAchievement(payload);

      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to save achievement data");
        },
        async () => {
          toast.success(isEditing ? "Achievement updated" : "Achievement created");
          closeModal();
          await refreshAchievements(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    formState.date,
    formState.description,
    formState.image_path,
    formState.title,
    isEditing,
    refreshAchievements,
    selectedAchievement?.id,
    service,
    setLoading,
  ]);

  const deleteAchievement = useCallback(async () => {
    if (!selectedAchievement?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deleteAchievement(selectedAchievement.id);
      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to delete achievement data");
        },
        async () => {
          toast.success("Achievement deleted");
          closeModal();
          await refreshAchievements(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [closeModal, currentPage, refreshAchievements, selectedAchievement?.id, service, setLoading]);

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1) return;
      await refreshAchievements(page);
    },
    [refreshAchievements],
  );

  const value: AchievementContextProps = {
    achievements,
    selectedAchievement,
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
    saveAchievement,
    deleteAchievement,
    uploadAchievementImage,
    goToPage,
  };

  return <AchievementLogic.Provider value={value}>{children}</AchievementLogic.Provider>;
};

export const useAchievementLogic = () => {
  const context = useContext(AchievementLogic);
  if (!context) {
    throw new Error("useAchievementLogic must be used within AchievementProvider");
  }
  return context;
};
