import { useRouter } from "next/router";
import AdminGuard from "@/features/core/presentation/admin/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { getAdminSectionFromSlug } from "@/features/core/presentation/admin/admin_logic";
import AdminUI from "@/features/core/presentation/admin/admin_ui";
import { GeneralProvider } from "@/features/core/presentation/admin/general/general_logic";
import GeneralUI from "@/features/core/presentation/admin/general/general_ui";
import { AchievementProvider } from "@/features/core/presentation/admin/achievement/achievement_logic";
import AchievementUI from "@/features/core/presentation/admin/achievement/achievement_ui";
import { WorkProvider } from "@/features/core/presentation/admin/work/work_logic";
import WorkUI from "@/features/core/presentation/admin/work/work_ui";
import { CodeLanguageProvider } from "@/features/core/presentation/admin/code_language/code_language_logic";
import CodeLanguageUI from "@/features/core/presentation/admin/code_language/code_language_ui";
import { FrameworkProvider } from "@/features/core/presentation/admin/framework/framework_logic";
import FrameworkUI from "@/features/core/presentation/admin/framework/framework_ui";
import { PortofolioProvider } from "@/features/core/presentation/admin/portofolio/portfolio/portfolio_logic";
import PortofolioUI from "@/features/core/presentation/admin/portofolio/portfolio/portfolio_ui";

function AdminSectionRoute() {
  const router = useRouter();
  const section = getAdminSectionFromSlug(router.query.section as string | undefined);

  if (!router.isReady || !section) {
    return null;
  }

  if (section === "dashboard") {
    return <AdminUI />;
  }

  if (section === "portfolio") {
    return (
      <PortofolioProvider>
        <PortofolioUI />
      </PortofolioProvider>
    );
  }

  if (section === "achievement") {
    return (
      <AchievementProvider>
        <AchievementUI />
      </AchievementProvider>
    );
  }

  if (section === "work") {
    return (
      <WorkProvider>
        <WorkUI />
      </WorkProvider>
    );
  }

  if (section === "code_language") {
    return (
      <CodeLanguageProvider>
        <CodeLanguageUI />
      </CodeLanguageProvider>
    );
  }

  if (section === "framework") {
    return (
      <FrameworkProvider>
        <FrameworkUI />
      </FrameworkProvider>
    );
  }

  if (section === "general") {
    return (
      <GeneralProvider>
        <GeneralUI />
      </GeneralProvider>
    );
  }

  return null;
}

export default function AdminSectionPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <AdminSectionRoute />
      </AdminProvider>
    </AdminGuard>
  );
}
