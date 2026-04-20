import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import AdminGuard from "@/features/core/presentation/admin/component/admin_guard";
import AdminUI from "@/features/core/presentation/admin/admin_ui";

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <AdminUI />
      </AdminProvider>
    </AdminGuard>
  );
}
