"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { WorkService } from "@/features/core/application/work_service";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { EitherType } from "@/shared/utils/utility/either";

export interface PortofolioFilters {
  search?: string;
  work_id?: string | null;
}

export function usePortofolioList(limit = 100) {
  const portofolioService = useMemo(() => new PortofolioService(), []);
  const workService = useMemo(() => new WorkService(), []);
  const [portofolios, setPortofolios] = useState<PortofolioResponse.Data[]>([]);
  const [works, setWorks] = useState<WorkResponse.Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorksLoading, setIsWorksLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [filters, setFilters] = useState<PortofolioFilters>({});

  const fetchWorks = useCallback(async () => {
    setIsWorksLoading(true);
    const result = await workService.fetchWorks({ page: 1, perPage: 100 });
    if (result.tag === EitherType.Right) {
      setWorks(result.right.data ?? []);
    }
    setIsWorksLoading(false);
  }, [workService]);

  const fetchPortofolios = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    const query: { page: number; perPage: number; search?: string; work_id?: string } = {
      page: 1,
      perPage: limit,
    };

    if (filters.search) {
      query.search = filters.search;
    }
    if (filters.work_id) {
      query.work_id = filters.work_id;
    }

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
    void fetchWorks();
  }, [fetchWorks]);

  const applyFilters = useCallback((newFilters: PortofolioFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return { 
    portofolios, 
    works,
    isLoading: isLoading || isWorksLoading, 
    errorMessage, 
    filters,
    applyFilters,
    clearFilters 
  };
}