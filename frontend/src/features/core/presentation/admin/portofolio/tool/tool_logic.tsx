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
import { ToolService } from "@/features/core/application/tool_service";
import { CreateToolRequest } from "@/features/core/domain/model/request/tool/create_tool_request";
import { ToolRequest } from "@/features/core/domain/model/request/tool/tool_request";
import { ToolResponse } from "@/features/core/domain/model/response/tool_response";
import { uploadFileWithSignature } from "@/shared/utils/utility/minio_upload";

interface ToolFormState {
  title: string;
  description: string;
  image_path: string;
  image_file?: File | null;
  position: string;
}

interface ToolContextProps {
  tools: ToolResponse.Data[];
  selectedTool: ToolResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: ToolFormState;
  currentPage: number;
  perPage: number;
  total: number;
  openCreateForm: () => void;
  openViewModal: (item: ToolResponse.Data) => void;
  openEditForm: (item: ToolResponse.Data) => void;
  openDeleteDialog: (item: ToolResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof ToolFormState, value: string) => void;
  saveTool: () => Promise<void>;
  deleteTool: () => Promise<void>;
  uploadToolImage: (file: File) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
}

const defaultFormState: ToolFormState = {
  title: "",
  description: "",
  image_path: "",
  image_file: null,
  position: "0",
};

const ToolContext = createContext<ToolContextProps | undefined>(undefined);

export const ToolProvider = ({ children }: { children: React.ReactNode }) => {
  const service = useMemo(() => new ToolService(), []);
  const { setLoading } = useLoading();
  const [tools, setTools] = useState<ToolResponse.Data[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolResponse.Data | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<ToolFormState>(defaultFormState);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const refreshTools = useCallback(
    async (page = 1) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const query: ToolRequest = { page, perPage };
        const result = await service.fetchTools(query);
        result.fold(
          (err) => toast.error(err.message ?? "Failed to load tool data"),
          (response) => {
            setTools(response.data ?? []);
            setTotal(response.total ?? 0);
            setCurrentPage(response.currentPage ?? page);
          },
        );
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    },
    [service, setLoading],
  );

  useEffect(() => {
    if (!didFetchInitialData.current) {
      didFetchInitialData.current = true;
      void refreshTools(1);
    }
  }, [refreshTools]);

  const openCreateForm = useCallback(() => {
    setFormState(defaultFormState);
    setIsEditing(false);
    setIsFormOpen(true);
  }, []);

  const openViewModal = useCallback((item: ToolResponse.Data) => {
    setSelectedTool(item);
    setIsDetailOpen(true);
  }, []);

  const openEditForm = useCallback((item: ToolResponse.Data) => {
    setSelectedTool(item);
    setFormState({
      title: item.title ?? "",
      description: item.description ?? "",
      image_path: item.image_path ?? "",
      image_file: null,
      position: String(item.position ?? 0),
    });
    setIsEditing(true);
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((item: ToolResponse.Data) => {
    setSelectedTool(item);
    setIsDeleteOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedTool(null);
    setIsEditing(false);
    setFormState(defaultFormState);
  }, []);

  const setFormField = useCallback(
    (field: keyof ToolFormState, value: string) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const saveTool = useCallback(async () => {
    if (!formState.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setIsSubmitting(true);
    try {
      const imagePath = formState.image_file
        ? await uploadFileWithSignature(
            formState.image_file,
            service.createUploadSignature.bind(service),
          )
        : formState.image_path || null;

      const payload: CreateToolRequest = {
        title: formState.title.trim(),
        description: formState.description?.trim() || null,
        image_path: imagePath,
        position: parseInt(formState.position, 10) || 0,
      };
      const result = isEditing && selectedTool
        ? await service.updateTool(selectedTool.id!, payload)
        : await service.createTool(payload);
      result.fold(
        (err) => toast.error(err.message ?? "Failed to save tool"),
        async () => {
          toast.success(`Tool ${isEditing ? "updated" : "created"} successfully`);
          closeModal();
          await refreshTools(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, isEditing, selectedTool, service, closeModal, refreshTools, currentPage]);

  const deleteTool = useCallback(async () => {
    if (!selectedTool) return;
    const toolId = selectedTool.id!;
    setIsSubmitting(true);
    try {
      const result = await service.deleteTool(toolId);
      result.fold(
        (err) => toast.error(err.message ?? "Failed to delete tool"),
        async () => {
          toast.success("Tool deleted successfully");
          closeModal();
          await refreshTools(currentPage);
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedTool, service, closeModal, refreshTools, currentPage]);

  const uploadToolImage = useCallback(async (file: File) => {
    setFormState((prev) => ({ ...prev, image_file: file }));
    toast.success("Image selected. It will upload when you save.");
  }, []);

  const totalPages = Math.max(1, Math.ceil((total || tools.length) / perPage));

  const goToPage = useCallback(async (page: number) => {
    if (page < 1 || page > totalPages) return;
    await refreshTools(page);
  }, [refreshTools, totalPages]);

  return (
    <ToolContext.Provider
      value={{
        tools,
        selectedTool,
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
        saveTool,
        deleteTool,
        uploadToolImage,
        goToPage,
      }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export const useToolLogic = () => {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error("useToolLogic must be used within ToolProvider");
  }
  return context;
};
