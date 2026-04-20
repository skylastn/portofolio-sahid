import { useRouter } from "next/router";
import AdminGuard from "@/features/core/presentation/admin/component/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { PortofolioFormProvider } from "@/features/core/presentation/admin/portofolio/portfolio/form/portfolio_form_logic";
import PortofolioFormUI from "@/features/core/presentation/admin/portofolio/portfolio/form/portfolio_form_ui";

function EditPortofolioRoute() {
  const router = useRouter();
  const portofolioId = typeof router.query.id === "string" ? router.query.id : undefined;

  if (!router.isReady || !portofolioId) {
    return null;
  }

  return (
    <PortofolioFormProvider mode="edit" portofolioId={portofolioId}>
      <PortofolioFormUI />
    </PortofolioFormProvider>
  );
}

export default function EditPortofolioPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <EditPortofolioRoute />
      </AdminProvider>
    </AdminGuard>
  );
}
