"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { WorkService } from "@/features/core/application/work_service";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { EitherType } from "@/shared/utils/utility/either";

export function useWorkList(limit = 100) {
  const workService = useMemo(() => new WorkService(), []);
  const [works, setWorks] = useState<WorkResponse.Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchWorks = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    const result = await workService.fetchWorks({ page: 1, perPage: limit });

    if (result.tag === EitherType.Left) {
      setErrorMessage(result.left.message);
      setWorks([]);
    } else {
      setWorks(result.right.data ?? []);
    }
    setIsLoading(false);
  }, [limit, workService]);

  useEffect(() => {
    void fetchWorks();
  }, [fetchWorks]);

  return { works, isLoading, errorMessage };
}