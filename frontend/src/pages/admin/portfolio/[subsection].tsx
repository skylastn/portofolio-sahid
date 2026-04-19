import { useRouter } from "next/router";
import AdminGuard from "@/features/core/presentation/admin/admin_guard";
import {
  AdminProvider,
  getPortfolioSubsectionFromSlug,
} from "@/features/core/presentation/admin/admin_logic";
import { CategoryProvider } from "../../../features/core/presentation/admin/portofolio/category/category_logic";
import CategoryUI from "../../../features/core/presentation/admin/portofolio/category/category_ui";
import { PortofolioProvider } from "../../../features/core/presentation/admin/portofolio/portfolio/portfolio_logic";
import PortofolioUI from "../../../features/core/presentation/admin/portofolio/portfolio/portfolio_ui";

function PortfolioSubsectionRoute() {
  const router = useRouter();
  const subsection = getPortfolioSubsectionFromSlug(
    router.query.subsection as string | undefined,
  );

  if (!router.isReady || !subsection) {
    return null;
  }

  if (subsection === "portfolio") {
    return (
      <PortofolioProvider>
        <PortofolioUI />
      </PortofolioProvider>
    );
  }

  if (subsection === "category") {
    return (
      <CategoryProvider>
        <CategoryUI />
      </CategoryProvider>
    );
  }

  return null;
}

export default function PortfolioSubsectionPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <PortfolioSubsectionRoute />
      </AdminProvider>
    </AdminGuard>
  );
}
