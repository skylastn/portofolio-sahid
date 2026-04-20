import AdminGuard from "@/features/core/presentation/admin/component/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { PortofolioProvider } from "@/features/core/presentation/admin/portofolio/portfolio/portfolio_logic";
import PortofolioUI from "@/features/core/presentation/admin/portofolio/portfolio/portfolio_ui";

export default function PortfolioAliasIndexPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <PortofolioProvider>
          <PortofolioUI />
        </PortofolioProvider>
      </AdminProvider>
    </AdminGuard>
  );
}
