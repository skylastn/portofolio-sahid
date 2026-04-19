import { useRouter } from "next/router";
import AdminGuard from "@/features/core/presentation/admin/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { getAdminSectionFromSlug } from "@/features/core/presentation/admin/admin_logic";
import AdminTableUI from "@/features/core/presentation/admin/admin_table_ui";
import AdminUI from "@/features/core/presentation/admin/admin_ui";
import { GeneralProvider } from "@/features/core/presentation/admin/general/general_logic";
import GeneralUI from "@/features/core/presentation/admin/general/general_ui";
import {
  PortfolioSection,
  TableView,
  useAdminLogic,
} from "@/features/core/presentation/admin/admin_logic";

function AdminSectionRoute() {
  const router = useRouter();
  const section = getAdminSectionFromSlug(router.query.section as string | undefined);
  const { tableViews } = useAdminLogic();

  if (!router.isReady || !section) {
    return null;
  }

  if (section === "dashboard") {
    return <AdminUI />;
  }

  if (section === "portfolio") {
    const portfolioViews = tableViews.portfolio as PortfolioSection;
    return (
      <AdminTableUI
        activeKey="portfolio"
        portfolioActiveKey="portfolio"
        title="Portfolio"
        tableView={portfolioViews.portfolio}
      />
    );
  }

  if (section === "general") {
    return (
      <GeneralProvider>
        <GeneralUI />
      </GeneralProvider>
    );
  }

  const tableView = tableViews[section] as TableView;
  return (
    <AdminTableUI
      activeKey={section}
      title={
        section === "code_language"
          ? "Code Language"
          : section.charAt(0).toUpperCase() + section.slice(1).replace(/_/g, " ")
      }
      tableView={tableView}
    />
  );
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
