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
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useLoading } from "@/shared/component/elements/loading_context";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { CreatePortofolioRequest } from "@/features/core/domain/model/request/portofolio/create_portofolio_request";
import { PortofolioRequest } from "@/features/core/domain/model/request/portofolio/portofolio_request";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { EitherType } from "@/shared/utils/utility/either";
import {
  buildUploadFileName,
  uploadFileToPresignedUrl,
} from "@/shared/utils/utility/minio_upload";

interface PortofolioFormState extends Pick<CreatePortofolioRequest, "work_id" | "title" | "description" | "thumbnail_path"> {}

interface PortofolioContextProps {
  portofolios: PortofolioResponse.Data[];
  selectedPortofolio: PortofolioResponse.Data | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: PortofolioFormState;
  currentPage: number;
  perPage: number;
  total: number;
  openCreateForm: () => void;
  openViewModal: (item: PortofolioResponse.Data) => Promise<void>;
  openEditForm: (item: PortofolioResponse.Data) => void;
  openDeleteDialog: (item: PortofolioResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof PortofolioFormState, value: string) => void;
  savePortofolio: () => Promise<void>;
  deletePortofolio: () => Promise<void>;
  uploadPortofolioThumbnail: (file: File) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const defaultFormState: PortofolioFormState = {
  work_id: "",
  title: "",
  description: "",
  thumbnail_path: "",
};

const PortofolioLogic = createContext<PortofolioContextProps | undefined>(
  undefined,
);

export const PortofolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const service = useMemo(() => new PortofolioService(), []);
  const { setLoading } = useLoading();
  const [portofolios, setPortofolios] = useState<PortofolioResponse.Data[]>([]);
  const [selectedPortofolio, setSelectedPortofolio] =
    useState<PortofolioResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<PortofolioFormState>(defaultFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const refreshPortofolios = useCallback(
    async (page = 1) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const query: PortofolioRequest = { page, perPage };
        const result = await service.fetchPortofolios(query);
        result.fold(
          (err) => toast.error(err.message ?? "Failed to load portfolio data"),
          (response) => {
            setPortofolios(response.data ?? []);
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
    void refreshPortofolios(1);
  }, [refreshPortofolios]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedPortofolio(null);
    setIsEditing(false);
    setFormState(defaultFormState);
  }, []);

  const openCreateForm = useCallback(() => {
    void router.push("/admin/portofolio/create");
  }, [router]);

  const openViewModal = useCallback(
    async (item: PortofolioResponse.Data) => {
      if (!item.id) return;
      setSelectedPortofolio(item);
      setIsDetailOpen(true);
      setIsDetailLoading(true);
      setLoading(true);
      try {
        const result = await service.fetchPortofolioById(item.id);
        result.fold(
          (err) => {
            toast.error(err.message ?? "Failed to load portfolio detail");
          },
          (response) => {
            setSelectedPortofolio(response);
          },
        );
      } finally {
        setIsDetailLoading(false);
        setLoading(false);
      }
    },
    [service, setLoading],
  );

  const openEditForm = useCallback((item: PortofolioResponse.Data) => {
    if (!item.id) return;
    void router.push(`/admin/portofolio/${item.id}/edit`);
  }, [router]);

  const openDeleteDialog = useCallback((item: PortofolioResponse.Data) => {
    setSelectedPortofolio(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback(
    (field: keyof PortofolioFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const uploadPortofolioThumbnail = useCallback(
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
        setFormState((prev) => ({ ...prev, thumbnail_path: signature.key }));
        toast.success("Thumbnail uploaded");
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

  const savePortofolio = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreatePortofolioRequest = {
        work_id: formState.work_id?.trim() || null,
        title: formState.title.trim(),
        description: formState.description.trim(),
        thumbnail_path: formState.thumbnail_path?.trim() || null,
      };

      if (!payload.title || !payload.description) {
        toast.error("Title and description are required");
        return;
      }

      const result =
        isEditing && selectedPortofolio?.id
          ? await service.updatePortofolio(selectedPortofolio.id, payload)
          : await service.createPortofolio(payload);

      result.fold(
        (err) => toast.error(err.message ?? "Failed to save portfolio data"),
        async () => {
          toast.success(isEditing ? "Portfolio updated" : "Portfolio created");
          closeModal();
          await refreshPortofolios(currentPage);
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
    formState.title,
    formState.work_id,
    formState.thumbnail_path,
    isEditing,
    refreshPortofolios,
    selectedPortofolio?.id,
    service,
    setLoading,
  ]);

  const deletePortofolio = useCallback(async () => {
    if (!selectedPortofolio?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deletePortofolio(selectedPortofolio.id);
      result.fold(
        (err) => toast.error(err.message ?? "Failed to delete portfolio data"),
        async () => {
          toast.success("Portfolio deleted");
          closeModal();
          await refreshPortofolios(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [closeModal, currentPage, refreshPortofolios, selectedPortofolio?.id, service, setLoading]);

  const goToPage = useCallback(
    async (page: number) => {
      if (page < 1) return;
      await refreshPortofolios(page);
    },
    [refreshPortofolios],
  );

  return (
    <PortofolioLogic.Provider
      value={{
        portofolios,
        selectedPortofolio,
        isLoading,
        isDetailLoading,
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
        savePortofolio,
        deletePortofolio,
        uploadPortofolioThumbnail,
        goToPage,
      }}
    >
      {children}
    </PortofolioLogic.Provider>
  );
};

export const usePortofolioLogic = () => {
  const context = useContext(PortofolioLogic);
  if (!context) {
    throw new Error("usePortofolioLogic must be used within PortofolioProvider");
  }
  return context;
};
