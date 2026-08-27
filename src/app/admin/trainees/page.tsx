import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Card, LinkButton, ProgressBar } from "@/components/ui";
import { DEPARTMENT_LABELS, departmentForRole } from "@/lib/progress";
import type { Department, Role } from "@/generated/prisma/enums";

const TABS: { label: string; value: Department | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Dispatch", value: "DISPATCH" },
  { label: "Tracking", value: "TRACKING" },
  { label: "HR", value: "HR" },
];

const DEPARTMENT_TONE: Record<Department, "accent" | "success" | "gold"> = {
  DISPATCH: "accent",
  TRACKING: "success",
  HR: "gold",
};

const ROLE_FOR_DEPARTMENT: Record<Exclude<Department, never>, Role> = {
  DISPATCH: "DISPATCHER",
  TRACKING: "TRACKING",
  HR: "HR",
};

export default async function TraineesPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { department } = await searchParams;
  const activeTab = TABS.some((t) => t.value === department) ? department! : "ALL";

  const [trainees, moduleCounts] = await Promise.all([
    prisma.user.findMany({
      where:
        activeTab === "ALL"
          ? { role: { in: ["DISPATCHER", "TRACKING", "HR"] } }
          : { role: ROLE_FOR_DEPARTMENT[activeTab as Department] },
      include: { progress: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.module.groupBy({
      by: ["department"],
      where: { published: true },
      _count: { _all: true },
    }),
  ]);

  const publishedByDepartment: Record<Department, number> = {
    DISPATCH: 0,
    TRACKING: 0,
    HR: 0,
  };
  for (const row of moduleCounts) {
    publishedByDepartment[row.department] = row._count._all;
  }

  const newTraineeHref =
    activeTab === "ALL" ? "/admin/trainees/new" : `/admin/trainees/new?department=${activeTab}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Trainees</h1>
          <p className="text-steel-500">
            Every account with access to the onboarding platform.
          </p>
        </div>
        <LinkButton href={newTraineeHref} variant="primary">
          + New trainee
        </LinkButton>
      </div>

      <div className="flex items-center gap-1.5 mb-6">
        {TABS.map((tab) => {
          const href = tab.value === "ALL" ? "/admin/trainees" : `/admin/trainees?department=${tab.value}`;
          const active = tab.value === activeTab;
          return (
            <Link
              key={tab.value}
              href={href}
              className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                active
                  ? "bg-navy-900 text-white"
                  : "text-steel-500 hover:bg-surface-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
              <th className="py-3 px-5 font-medium">Name</th>
              <th className="py-3 px-5 font-medium">Email</th>
              {activeTab === "ALL" && <th className="py-3 px-5 font-medium">Department</th>}
              <th className="py-3 px-5 font-medium w-56">Progress</th>
            </tr>
          </thead>
          <tbody>
            {trainees.map((t) => {
              const dept = departmentForRole(t.role) ?? "DISPATCH";
              const publishedCount = publishedByDepartment[dept];
              const percent =
                publishedCount === 0
                  ? 0
                  : Math.round((t.progress.length / publishedCount) * 100);
              return (
                <tr
                  key={t.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-surface-muted"
                >
                  <td className="py-3 px-5">
                    <Link
                      href={`/admin/trainees/${t.id}`}
                      className="font-medium text-navy-900 hover:text-accent-600"
                    >
                      {t.name}
                    </Link>
                  </td>
                  <td className="py-3 px-5 text-steel-500">{t.email}</td>
                  {activeTab === "ALL" && (
                    <td className="py-3 px-5">
                      <Badge tone={DEPARTMENT_TONE[dept]}>{DEPARTMENT_LABELS[dept]}</Badge>
                    </td>
                  )}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar percent={percent} />
                      </div>
                      <span className="text-xs text-steel-500 w-16 text-right">
                        {t.progress.length}/{publishedCount}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {trainees.length === 0 && (
              <tr>
                <td colSpan={activeTab === "ALL" ? 4 : 3} className="py-8 text-center text-steel-500">
                  No trainee accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
