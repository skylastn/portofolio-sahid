import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import delay from "@/shared/utils/utility/delay";
import { useAuthService } from "@/shared/dependency_injection/global_container";
import { LoginRequest } from "@/features/auth/domain/model/request/login_request";
import { Either, left, right } from "@/shared/utils/utility/either";
import { UserResponse } from "../../features/auth/domain/model/response/user_response";

interface AuthContextProps {
  isLogin: boolean;
  user: UserResponse.Data | null;
  logout: () => Promise<void>;
  login: (
    request: LoginRequest,
  ) => Promise<Either<string, UserResponse.Data | null>>;
}

const AuthLogic = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const service = useAuthService();
  const [isLogin, setIsLogin] = useState(service.isLogin);
  const [user, setUser] = useState<UserResponse.Data | null>(service.user);

  const login = useCallback(
    async (
      request: LoginRequest,
    ): Promise<Either<string, UserResponse.Data | null>> => {
      try {
        const res = await service.login(request);
        await delay(1);
        let loggedInUser: UserResponse.Data | null = null;

        res.fold(
          (err) => {
            const message = err.message ?? "";
            throw new Error(message);
          },
          async (r) => {
            loggedInUser = r.user ?? null;
            setIsLogin(true);
            setUser(loggedInUser);
          },
        );
        return right(loggedInUser);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message);
        return left(message);
      }
    },
    [service],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await service.logout();
      setIsLogin(false);
      setUser(null);
      toast.success("Berhasil Logout!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    }
  }, [service]);

  useEffect(() => {
    const handleUnauthorized = async () => {
      if (router.pathname.startsWith("/auth/login")) return;

      await service.logout();
      setIsLogin(false);
      setUser(null);
      toast.error("Session expired. Please login again.");

      const redirect = router.asPath.startsWith("/auth")
        ? "/admin"
        : router.asPath;
      void router.replace(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
    };

    window.addEventListener("app:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("app:unauthorized", handleUnauthorized);
    };
  }, [router, service]);

  const value = useMemo(
    () => ({
      isLogin,
      user,
      logout,
      login,
    }),
    [isLogin, logout, login],
  );

  return <AuthLogic.Provider value={value}>{children}</AuthLogic.Provider>;
};

export const useAuthLogic = () => {
  const context = useContext(AuthLogic);
  if (!context) {
    throw new Error("useAuthLogic must be used within AuthProvider");
  }
  return context;
};
