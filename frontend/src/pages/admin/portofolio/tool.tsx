import AdminGuard from "@/features/core/presentation/admin/component/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { ToolProvider } from "@/features/core/presentation/admin/portofolio/tool/tool_logic";
import ToolUI from "@/features/core/presentation/admin/portofolio/tool/tool_ui";

export default function PortofolioToolPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <ToolProvider>
          <ToolUI />
        </ToolProvider>
      </AdminProvider>
    </AdminGuard>
  );
}
