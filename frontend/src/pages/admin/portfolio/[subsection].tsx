import { useRouter } from "next/router";
import AdminGuard from "@/features/core/presentation/admin/admin_guard";
import {
  AdminProvider,
  getPortfolioSubsectionFromSlug,
  PortfolioSection,
  useAdminLogic,
} from "@/features/core/presentation/admin/admin_logic";
import AdminTableUI from "@/features/core/presentation/admin/admin_table_ui";
import { CategoryProvider } from "../../../features/core/presentation/admin/portofolio/category/category_logic";
import CategoryUI from "../../../features/core/presentation/admin/portofolio/category/category_ui";

function PortfolioSubsectionRoute() {
  const router = useRouter();
  const subsection = getPortfolioSubsectionFromSlug(
    router.query.subsection as string | undefined,
  );
  const { tableViews } = useAdminLogic();

  if (!router.isReady || !subsection) {
    return null;
  }

  if (subsection === "category") {
    return (
      <CategoryProvider>
        <CategoryUI />
      </CategoryProvider>
    );
  }

  const portfolioViews = tableViews.portfolio as PortfolioSection;
  return (
    <AdminTableUI
      activeKey="portfolio"
      portfolioActiveKey={subsection}
      title={subsection === "portfolio" ? "Portfolio" : "Category"}
      tableView={portfolioViews[subsection]}
    />
  );
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
