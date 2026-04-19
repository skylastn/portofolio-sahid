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
import { ResponseModel } from "@/shared/domain/model/response_model";
import { CategoryService } from "@/features/core/application/category_service";
import {
  CategoryRequest,
} from "@/features/core/domain/model/request/category/category_request";
import { CreateCategoryRequest } from "@/features/core/domain/model/request/category/create_category_request";
import { CategoryResponse } from "@/features/core/domain/model/response/category_response";

interface CategoryFormState {
  title: string;
  description: string;
}

interface CategoryContextProps {
  categories: CategoryResponse.Data[];
  selectedCategory: CategoryResponse.Data | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isDetailOpen: boolean;
  isFormOpen: boolean;
  isDeleteOpen: boolean;
  isEditing: boolean;
  formState: CategoryFormState;
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
  setIsDetailOpen: (value: boolean) => void;
  setIsFormOpen: (value: boolean) => void;
  setIsDeleteOpen: (value: boolean) => void;
  openCreateForm: () => void;
  openViewModal: (item: CategoryResponse.Data) => void;
  openEditForm: (item: CategoryResponse.Data) => void;
  openDeleteDialog: (item: CategoryResponse.Data) => void;
  closeModal: () => void;
  setFormField: (field: keyof CategoryFormState, value: string) => void;
  saveCategory: () => Promise<void>;
  deleteCategory: () => Promise<void>;
  refreshCategories: (query?: CategoryRequest) => Promise<void>;
  setPage: (page: number) => void;
}

const CategoryLogic = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  const service = useMemo(() => new CategoryService(), []);
  const { setLoading } = useLoading();
  const [categories, setCategories] = useState<CategoryResponse.Data[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<CategoryFormState>({
    title: "",
    description: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const didFetchInitialData = useRef(false);

  const totalPages = useMemo(() => {
    if (!perPage) return 0;
    return Math.max(1, Math.ceil(total / perPage));
  }, [perPage, total]);

  const applyPagination = useCallback(
    (response: ResponseModel<CategoryResponse.Data[]>) => {
      setCategories(response.data ?? []);
      setCurrentPage(response.currentPage ?? 1);
      setPerPage(response.perPage ?? perPage);
      setTotal(response.total ?? 0);
    },
    [perPage],
  );

  const refreshCategories = useCallback(
    async (query?: CategoryRequest) => {
      setLoading(true);
      setIsLoading(true);
      try {
        const result = await service.fetchCategories(query);
        result.fold(
          (err) => {
            toast.error(err.message ?? "Failed to load categories");
          },
          (response) => {
            applyPagination(response);
          },
        );
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    },
    [applyPagination, service, setLoading],
  );

  useEffect(() => {
    if (didFetchInitialData.current) return;
    didFetchInitialData.current = true;
    void refreshCategories({ page: 1, perPage: 10 });
  }, [refreshCategories]);

  const closeModal = useCallback(() => {
    setIsDetailOpen(false);
    setIsFormOpen(false);
    setIsDeleteOpen(false);
    setSelectedCategory(null);
    setIsEditing(false);
    setFormState({ title: "", description: "" });
  }, []);

  const openCreateForm = useCallback(() => {
    setSelectedCategory(null);
    setIsEditing(false);
    setFormState({ title: "", description: "" });
    setIsFormOpen(true);
  }, []);

  const openViewModal = useCallback((item: CategoryResponse.Data) => {
    setSelectedCategory(item);
    setIsDetailOpen(true);
  }, []);

  const openEditForm = useCallback((item: CategoryResponse.Data) => {
    setSelectedCategory(item);
    setIsEditing(true);
    setFormState({
      title: item.title ?? "",
      description: item.description ?? "",
    });
    setIsFormOpen(true);
  }, []);

  const openDeleteDialog = useCallback((item: CategoryResponse.Data) => {
    setSelectedCategory(item);
    setIsDeleteOpen(true);
  }, []);

  const setFormField = useCallback(
    (field: keyof CategoryFormState, value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const saveCategory = useCallback(async () => {
    setIsSubmitting(true);
    setLoading(true);
    try {
      const payload: CreateCategoryRequest = {
        title: formState.title.trim(),
        description: formState.description.trim(),
      };
      if (!payload.title || !payload.description) {
        toast.error("Title and description are required");
        return;
      }

      const result = isEditing && selectedCategory?.id
        ? await service.updateCategory(selectedCategory.id, payload)
        : await service.createCategory(payload);

      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to save category");
        },
        async () => {
          toast.success(isEditing ? "Category updated" : "Category created");
          closeModal();
          await refreshCategories({ page: currentPage, perPage });
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
    isEditing,
    perPage,
    refreshCategories,
    selectedCategory?.id,
    service,
    setLoading,
  ]);

  const deleteCategory = useCallback(async () => {
    if (!selectedCategory?.id) return;
    setIsSubmitting(true);
    setLoading(true);
    try {
      const result = await service.deleteCategory(selectedCategory.id);
      result.fold(
        (err) => {
          toast.error(err.message ?? "Failed to delete category");
        },
        async () => {
          toast.success("Category deleted");
          closeModal();
          await refreshCategories({ page: currentPage, perPage });
        },
      );
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [
    closeModal,
    currentPage,
    perPage,
    refreshCategories,
    selectedCategory?.id,
    service,
    setLoading,
  ]);

  const value: CategoryContextProps = {
    categories,
    selectedCategory,
    isLoading,
    isSubmitting,
    isDetailOpen,
    isFormOpen,
    isDeleteOpen,
    isEditing,
    formState,
    currentPage,
    perPage,
    total,
    totalPages,
    setIsDetailOpen,
    setIsFormOpen,
    setIsDeleteOpen,
    openCreateForm,
    openViewModal,
    openEditForm,
    openDeleteDialog,
    closeModal,
    setFormField,
    saveCategory,
    deleteCategory,
    refreshCategories,
    setPage: (page: number) => {
      void refreshCategories({ page, perPage });
    },
  };

  return <CategoryLogic.Provider value={value}>{children}</CategoryLogic.Provider>;
};

export const useCategoryLogic = () => {
  const context = useContext(CategoryLogic);
  if (!context) {
    throw new Error("useCategoryLogic must be used within CategoryProvider");
  }
  return context;
};
