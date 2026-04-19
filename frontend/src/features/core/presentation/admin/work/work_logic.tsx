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
import { WorkService } from "@/features/core/application/work_service";
import { CreateWorkRequest } from "@/features/core/domain/model/request/work/create_work_request";
import { WorkRequest } from "@/features/core/domain/model/request/work/work_request";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { EitherType } from "@/shared/utils/utility/either";
import {
  buildUploadFileName,
  uploadFileToPresignedUrl,
} from "@/shared/utils/utility/minio_upload";

interface WorkFormState extends CreateWorkRequest {}

interface WorkContextProps {
  works: WorkResponse.Data[];
  selectedWork: WorkResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: WorkFormState;
  currentPage: number;
  perPage: number;
  total: number;
  openCreateForm: () => void;
  openViewModal: (item: WorkResponse.Data) => void;
  openEditForm: (item: WorkResponse.Data) => void;
  openDeleteDialog: (item: WorkResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof WorkFormState, value: string) => void;
  saveWork: () => Promise<void>;
  deleteWork: () => Promise<void>;
  uploadWorkImage: (file: File) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const defaultFormState: WorkFormState = {
  company_name: "",
  company_url: "",
  job_title: "",
  description: "",
  start_date: "",
  end_date: "",
  image_path: "",
};

const WorkLogic = createContext<WorkContextProps | undefined>(undefined);

export const WorkProvider = ({ children }: { children: React.ReactNode }) => {
  const service = useMemo(() => new WorkService(), []);
  const { setLoading } = useLoading();
  const [works, setWorks] = useState<WorkResponse.Data[]>([]);
  const [selectedWork, setSelectedWork] = useState<WorkResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<WorkFormState>(defaultFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const refreshWorks = useCallback(
    async (page = 1) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const query: WorkRequest = { page, perPage };
        const result = await service.fetchWorks(query);
        result.fold(
          (err) => toast.error(err.message ?? "Failed to load work data"),
          (response) => {
            setWorks(response.data ?? []);
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
    void refreshWorks(1);
  }, [refreshWorks]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedWork(null);
    setIsEditing(false);
    setFormState(defaultFormState);
  }, []);

  const openCreateForm = useCallback(() => {
    setSelectedWork(null);
    setIsEditing(false);
    setFormState(defaultFormState);
    setIsFormOpen(true);
  }, []);

  const openViewModal = useCallback((item: WorkResponse.Data) => {
    setSelectedWork(item);
    setIsDetailOpen(true);
  }, []);

  const openEditForm = useCallback((item: WorkResponse.Data) => {
    setSelectedWork(item);
    setIsEditing(true);
    setFormState({
      company_name: item.company_name ?? "",
      company_url: item.company_url ?? "",
      job_title: item.job_title ?? "",
      description: item.description ?? "",
      start_date: item.start_date ? String(item.start_date).slice(0, 10) : "",
      end_date: item.end_date ? String(item.end_date).slice(0, 10) : "",
      image_path: item.image_path ?? "",
    });
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((item: WorkResponse.Data) => {
    setSelectedWork(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback((field: keyof WorkFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const uploadWorkImage = useCallback(
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

  const saveWork = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreateWorkRequest = {
        company_name: formState.company_name.trim(),
        company_url: formState.company_url?.trim() || null,
        job_title: formState.job_title.trim(),
        description: formState.description.trim(),
        start_date: formState.start_date.trim(),
        end_date: formState.end_date?.trim() || null,
        image_path: formState.image_path?.trim() || null,
      };

      if (!payload.company_name || !payload.job_title || !payload.description || !payload.start_date) {
        toast.error("Company, job title, description, and start date are required");
        return;
      }

      const result =
        isEditing && selectedWork?.id
          ? await service.updateWork(selectedWork.id, payload)
          : await service.createWork(payload);

      result.fold(
        (err) => toast.error(err.message ?? "Failed to save work data"),
        async () => {
          toast.success(isEditing ? "Work updated" : "Work created");
          closeModal();
          await refreshWorks(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    formState.company_name,
    formState.company_url,
    formState.description,
    formState.end_date,
    formState.image_path,
    formState.job_title,
    formState.start_date,
    isEditing,
    refreshWorks,
    selectedWork?.id,
    service,
    setLoading,
  ]);

  const deleteWork = useCallback(async () => {
    if (!selectedWork?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deleteWork(selectedWork.id);
      result.fold(
        (err) => toast.error(err.message ?? "Failed to delete work data"),
        async () => {
          toast.success("Work deleted");
          closeModal();
          await refreshWorks(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [closeModal, currentPage, refreshWorks, selectedWork?.id, service, setLoading]);

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1) return;
      await refreshWorks(page);
    },
    [refreshWorks],
  );

  return (
    <WorkLogic.Provider
      value={{
        works,
        selectedWork,
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
        saveWork,
        deleteWork,
        uploadWorkImage,
        goToPage,
      }}
    >
      {children}
    </WorkLogic.Provider>
  );
};

export const useWorkLogic = () => {
  const context = useContext(WorkLogic);
  if (!context) {
    throw new Error("useWorkLogic must be used within WorkProvider");
  }
  return context;
};
