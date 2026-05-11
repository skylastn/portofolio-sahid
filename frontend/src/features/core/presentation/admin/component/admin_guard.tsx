"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useAuthLogic } from "@/shared/logic/auth_logic";
import { UserRole } from "@/features/auth/domain/model/enum/user_role";

type AdminGuardProps = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const { isLogin, user, logout } = useAuthLogic();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const role = user?.role;

    if (!isLogin) {
      setIsReady(false);
      router.replace(
        `/auth/login?redirect=${encodeURIComponent(router.asPath)}`,
      );
      return;
    }

    if (role !== UserRole.ADMIN) {
      setIsReady(false);
      toast.error("Only admin accounts can access this page.");
      void logout().finally(() => {
        void router.replace("/");
      });
      return;
    }

    setIsReady(true);
  }, [isLogin, logout, router, router.asPath, router.isReady, user?.role]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}
