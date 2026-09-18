import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getTraineeProgress, departmentForRole } from "@/lib/progress";
import { TraineeSidebar } from "@/components/trainee-sidebar";
import { LiveClock } from "@/components/live-clock";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const department = departmentForRole(user.role);
  if (!department) {
    redirect("/admin");
  }

  const { modules, completed, total, percent, certificateUnlocked } =
    await getTraineeProgress(user.id, department);

  return (
    <div className="flex h-screen overflow-hidden">
      <TraineeSidebar
        department={department}
        modules={modules.map((m) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          category: m.category,
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
