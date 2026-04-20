"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthLogic } from "@/shared/logic/auth_logic";
import { UserRole } from "@/features/auth/domain/model/enum/user_role";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isLogin, user } = useAuthLogic();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const role = user?.role;
    const canAccess = isLogin && role === UserRole.ADMIN;

    if (!canAccess) {
      router.replace("/auth/login");
      return;
    }

    setIsReady(true);
  }, [isLogin, router, router.isReady, user?.role]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
