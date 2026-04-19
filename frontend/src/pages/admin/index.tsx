import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import AdminUI from "@/features/core/presentation/admin/admin_ui";

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminUI />
    </AdminProvider>
  );
}
