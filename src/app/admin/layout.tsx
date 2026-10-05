import type { Metadata } from "next";
import { requireAdminScope } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin-sidebar";
import { LiveClock } from "@/components/live-clock";
import { PageTransition } from "@/components/page-transition";
import { ONBOARDING_LABELS } from "@/lib/departments";

// A department admin's tab names their programme; a company-wide admin's does not.
export async function generateMetadata(): Promise<Metadata> {
  const { scope } = await requireAdminScope();
  return {
    title: scope
      ? `Empire National | ${ONBOARDING_LABELS[scope]} Admin`
      : "Empire National | Admin",
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, scope } = await requireAdminScope();

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar userName={user.name} scope={scope} />
      <main className="flex-1 min-w-0 min-h-0 bg-surface-muted overflow-y-auto">
        <PageTransition>{children}</PageTransition>
      </main>
      <LiveClock />
    </div>
  );
}
