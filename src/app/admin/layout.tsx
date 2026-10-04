import { requireAdmin } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin-sidebar";
import { LiveClock } from "@/components/live-clock";
import { PageTransition } from "@/components/page-transition";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar userName={user.name} />
      <main className="flex-1 min-w-0 min-h-0 bg-surface-muted overflow-y-auto">
        <PageTransition>{children}</PageTransition>
      </main>
      <LiveClock />
    </div>
  );
}
