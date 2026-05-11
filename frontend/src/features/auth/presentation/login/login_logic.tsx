import { useLoading } from "@/shared/component/elements/loading_context";
import { useAuthLogic } from "@/shared/logic/auth_logic";
import delay from "@/shared/utils/utility/delay";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { UserRole } from "../../domain/model/enum/user_role";

export const useLoginLogic = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoading } = useLoading();
  const authLogic = useAuthLogic();

  const handlerLogin = async (): Promise<void> => {
    setLoading(true);
    try {
      const result = await authLogic.login({
        username: username,
        password: password,
      });
      result.fold(
        (err) => {
          if (err === "Email belum diverifikasi") {
            router.push("/auth/verify");
          }
        },
        async (user) => {
          await delay(1);
          toast.success("Berhasil Login!");
          if (user?.role === UserRole.ADMIN) {
            // const redirect = Array.isArray(router.query.redirect)
            //   ? router.query.redirect[0]
            //   : router.query.redirect;
            // router.push(
            //   redirect && redirect.startsWith("/") ? redirect : "/admin",
            // );
            router.push("/admin");
            return;
          }
          toast.error("Only admin accounts can access the admin page.");
          router.push("/");
        },
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };
  return { handlerLogin, setUsername, setPassword };
};
