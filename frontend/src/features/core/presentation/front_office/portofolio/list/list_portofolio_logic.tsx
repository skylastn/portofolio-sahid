"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { WorkService } from "@/features/core/application/work_service";
import { CategoryService } from "@/features/core/application/category_service";
import { FrameworkService } from "@/features/core/application/framework_service";
import { CodeLanguageService } from "@/features/core/application/code_language_service";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { CategoryResponse } from "@/features/core/domain/model/response/category_response";
import { FrameworkResponse } from "@/features/core/domain/model/response/framework_response";
import { CodeLanguageResponse } from "@/features/core/domain/model/response/code_language_response";
import { EitherType } from "@/shared/utils/utility/either";

export interface PortofolioFilters {
  search?: string;
  work_ids?: string[];
  category_ids?: string[];
  framework_ids?: string[];
  code_language_ids?: string[];
}

export function usePortofolioList(limit = 100) {
  const portofolioService = useMemo(() => new PortofolioService(), []);
  const workService = useMemo(() => new WorkService(), []);
  const categoryService = useMemo(() => new CategoryService(), []);
  const frameworkService = useMemo(() => new FrameworkService(), []);
  const codeLanguageService = useMemo(() => new CodeLanguageService(), []);
  const [portofolios, setPortofolios] = useState<PortofolioResponse.Data[]>([]);
  const [works, setWorks] = useState<WorkResponse.Data[]>([]);
  const [categories, setCategories] = useState<CategoryResponse.Data[]>([]);
  const [frameworks, setFrameworks] = useState<FrameworkResponse.Data[]>([]);
  const [codeLanguages, setCodeLanguages] = useState<CodeLanguageResponse.Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [filters, setFilters] = useState<PortofolioFilters>({});

  const fetchOptions = useCallback(async () => {
    setIsOptionsLoading(true);
    const [workResult, categoryResult, frameworkResult, codeLanguageResult] =
      await Promise.all([
        workService.fetchWorks({ page: 1, perPage: 100 }),
        categoryService.fetchCategories({ page: 1, perPage: 100 }),
        frameworkService.fetchFrameworks({ page: 1, perPage: 100 }),
        codeLanguageService.fetchCodeLanguages({ page: 1, perPage: 100 }),
      ]);

    if (workResult.tag === EitherType.Right) {
      setWorks(workResult.right.data ?? []);
    }
    if (categoryResult.tag === EitherType.Right) {
      setCategories(categoryResult.right.data ?? []);
    }
    if (frameworkResult.tag === EitherType.Right) {
      setFrameworks(frameworkResult.right.data ?? []);
    }
    if (codeLanguageResult.tag === EitherType.Right) {
      setCodeLanguages(codeLanguageResult.right.data ?? []);
    }
    setIsOptionsLoading(false);
  }, [categoryService, codeLanguageService, frameworkService, workService]);

  const fetchPortofolios = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    const query = {
      page: 1,
      perPage: limit,
      search: filters.search || undefined,
      work_ids: filters.work_ids?.length ? filters.work_ids : undefined,
      category_id: filters.category_ids?.length ? filters.category_ids : undefined,
      framework_id: filters.framework_ids?.length ? filters.framework_ids : undefined,
      code_language_id: filters.code_language_ids?.length
        ? filters.code_language_ids
        : undefined,
    };

    const result = await portofolioService.fetchPortofolios(query);

    if (result.tag === EitherType.Left) {
      setErrorMessage(result.left.message);
      setPortofolios([]);
    } else {
      setPortofolios(result.right.data ?? []);
    }
    setIsLoading(false);
  }, [limit, portofolioService, filters]);

  useEffect(() => {
    void fetchPortofolios();
  }, [fetchPortofolios]);

  useEffect(() => {
    void fetchOptions();
  }, [fetchOptions]);

  const applyFilters = useCallback((newFilters: PortofolioFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return { 
    portofolios, 
    works,
    categories,
    frameworks,
    codeLanguages,
    isLoading: isLoading || isOptionsLoading, 
    errorMessage, 
    filters,
    applyFilters,
    clearFilters 
  };
}
