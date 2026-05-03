"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AchievementService } from "@/features/core/application/achievement_service";
import { AchievementResponse } from "@/features/core/domain/model/response/achievement_response";
import { EitherType } from "@/shared/utils/utility/either";

export function useAchievementList(limit = 100) {
  const achievementService = useMemo(() => new AchievementService(), []);
  const [achievements, setAchievements] = useState<AchievementResponse.Data[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const fetchAchievements = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(undefined);

    const result = await achievementService.fetchAchievements({ page: 1, perPage: limit });

    if (result.tag === EitherType.Left) {
      setErrorMessage(result.left.message);
      setAchievements([]);
    } else {
      setAchievements(result.right.data ?? []);
    }
    setIsLoading(false);
  }, [limit, achievementService]);

  useEffect(() => {
    void fetchAchievements();
  }, [fetchAchievements]);

  return { achievements, isLoading, errorMessage };
}