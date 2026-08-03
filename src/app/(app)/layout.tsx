import { requireUser } from "@/lib/dal";
import { getDispatcherProgress } from "@/lib/progress";
import { DispatchSidebar } from "@/components/dispatch-sidebar";
import { LiveClock } from "@/components/live-clock";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const { modules, completed, total, percent, certificateUnlocked } =
    await getDispatcherProgress(user.id);

  return (
    <div className="flex h-screen overflow-hidden">
      <DispatchSidebar
        modules={modules.map((m) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          status: m.status,
        }))}
        completed={completed}
        total={total}
        percent={percent}
        certificateUnlocked={certificateUnlocked}
        userName={user.name}
        userTitle={user.title}
      />
      <main className="flex-1 min-w-0 min-h-0 bg-surface-muted overflow-y-auto">
        {children}
      </main>
      <LiveClock />
    </div>
  );
}
