"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AchievementService } from "@/features/core/application/achievement_service";
import { PortofolioService } from "@/features/core/application/portofolio_service";
import { WorkService } from "@/features/core/application/work_service";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { PortofolioResponse } from "@/features/core/domain/model/response/portofolio/portofolio_response";
import { WorkResponse } from "@/features/core/domain/model/response/work_response";
import { EitherType } from "@/shared/utils/utility/either";

export type PublicContentType = "portofolio" | "work" | "achievement";

export interface PublicContentState {
  portofolios: PortofolioResponse.Data[];
  works: WorkResponse.Data[];
  achievements: AchievementResponse.Data[];
  isLoading: boolean;
  errorMessage?: string;
}

export function usePublicContent(limit = 3) {
  const portofolioService = useMemo(() => new PortofolioService(), []);
  const workService = useMemo(() => new WorkService(), []);
  const achievementService = useMemo(() => new AchievementService(), []);
  const [state, setState] = useState<PublicContentState>({
    portofolios: [],
    works: [],
    achievements: [],
    isLoading: true,
  });

  const fetchContent = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, errorMessage: undefined }));

    const [portofolioResult, workResult, achievementResult] = await Promise.all([
      portofolioService.fetchPortofolios({ page: 1, perPage: limit }),
      workService.fetchWorks({ page: 1, perPage: limit }),
      achievementService.fetchAchievements({ page: 1, perPage: limit }),
    ]);

    const errorMessage =
      portofolioResult.tag === EitherType.Left
        ? portofolioResult.left.message
        : workResult.tag === EitherType.Left
          ? workResult.left.message
          : achievementResult.tag === EitherType.Left
            ? achievementResult.left.message
            : undefined;

    setState({
      portofolios:
        portofolioResult.tag === EitherType.Right
          ? (portofolioResult.right.data ?? [])
          : [],
      works: workResult.tag === EitherType.Right ? (workResult.right.data ?? []) : [],
      achievements:
        achievementResult.tag === EitherType.Right
          ? (achievementResult.right.data ?? [])
          : [],
      isLoading: false,
      errorMessage,
    });
  }, [achievementService, limit, portofolioService, workService]);

  useEffect(() => {
    void fetchContent();
  }, [fetchContent]);

  return state;
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

