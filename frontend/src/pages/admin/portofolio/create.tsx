import AdminGuard from "@/features/core/presentation/admin/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { PortofolioFormProvider } from "@/features/core/presentation/admin/portofolio/portfolio/portfolio_form_logic";
import PortofolioFormUI from "@/features/core/presentation/admin/portofolio/portfolio/portfolio_form_ui";

export default function CreatePortofolioPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <PortofolioFormProvider mode="create">
          <PortofolioFormUI />
        </PortofolioFormProvider>
      </AdminProvider>
    </AdminGuard>
  );
}
