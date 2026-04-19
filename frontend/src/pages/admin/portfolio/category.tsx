import AdminGuard from "@/features/core/presentation/admin/admin_guard";
import { AdminProvider } from "@/features/core/presentation/admin/admin_logic";
import { CategoryProvider } from "@/features/core/presentation/admin/portofolio/category/category_logic";
import CategoryUI from "@/features/core/presentation/admin/portofolio/category/category_ui";

export default function PortfolioAliasCategoryPage() {
  return (
    <AdminGuard>
      <AdminProvider>
        <CategoryProvider>
          <CategoryUI />
        </CategoryProvider>
      </AdminProvider>
    </AdminGuard>
  );
}
