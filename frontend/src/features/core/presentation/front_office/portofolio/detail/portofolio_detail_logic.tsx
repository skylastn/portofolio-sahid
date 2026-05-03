"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { EitherType } from "@/shared/utils/utility/either";

export function usePortofolioDetail() {
  const service = useMemo(() => new PortofolioService(), []);
  const [item, setItem] = useState<PortofolioResponse.Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchDetail = useCallback(async (id: string) => {
    setIsLoading(true);
    setErrorMessage(undefined);

    const result = await service.fetchPortofolioById(id);

    if (result.tag === EitherType.Left) {
      setErrorMessage(result.left.message ?? "Failed to load portofolio detail");
      setItem(null);
    } else {
      setItem(result.right);
    }
    setIsLoading(false);
  }, [service]);

  return { item, isLoading, errorMessage, fetchDetail };
}

export function formatDisplayDate(value?: string | Date | null) {
  if (!value) return "Present";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en", {
    month: "short",
    year: "numeric",
  });
}