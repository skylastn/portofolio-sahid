import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import type { CSSProperties } from "react";
import "@/shared/styles/globals.css";
import { Toaster } from "react-hot-toast";

import {
  LoadingProvider,
  useLoading,
} from "@/shared/component/elements/loading_context";
import "@/shared/utils/extension/money_ext";
import { GlobalContainerProvider } from "@/shared/dependency_injection/global_container";
import LoadingComponent from "@/shared/component/ui/loading/loading_component";
import { GlobalProvider, useGlobalLogic } from "@/shared/logic/global_logic";
import { AuthProvider } from "@/shared/logic/auth_logic";

function GlobalLoader() {
  const { loading } = useLoading();
  const { isDarkMode } = useGlobalLogic();
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");
  const overlayStyle = {
    ["--loader-overlay-glow" as string]: isDarkMode
      ? "rgba(34, 211, 238, 0.10)"
      : "rgba(14, 165, 233, 0.08)",
    ["--loader-overlay-scrim" as string]: isDarkMode
      ? "rgba(15, 23, 42, 0.34)"
      : "rgba(148, 163, 184, 0.18)",
    ["--loader-overlay-backdrop" as string]: isDarkMode
      ? "rgba(2, 6, 23, 0.74)"
      : "rgba(248, 250, 252, 0.72)",
  } as CSSProperties;

  return loading ? (
    <div className="floating-loader" style={overlayStyle}>
      <LoadingComponent
        isDarkMode={isDarkMode}
        title={isAdminRoute ? "Loading admin page" : "Loading"}
        subtitle={
          isAdminRoute
            ? "Syncing the current admin theme and content."
            : "Please wait a moment."
        }
        eyebrow={isAdminRoute ? "Admin" : undefined}
      />
    </div>
  ) : null;
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GlobalContainerProvider>
      <LoadingProvider>
        <GlobalProvider>
          <Toaster position="top-right" />
          <GlobalLoader />
          <AuthProvider>{children}</AuthProvider>
        </GlobalProvider>
      </LoadingProvider>
    </GlobalContainerProvider>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
