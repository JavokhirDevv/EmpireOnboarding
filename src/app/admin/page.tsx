import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdminScope } from "@/lib/dal";
import { Card, LinkButton, Badge } from "@/components/ui";
import { DEPARTMENT_LABELS, departmentForRole } from "@/lib/progress";
import type { Department } from "@/generated/prisma/enums";

const DEPARTMENT_TONE: Record<Department, "accent" | "success" | "gold"> = {
  DISPATCH: "accent",
  TRACKING: "success",
  HR: "gold",
};

const ROLE_FOR_DEPARTMENT: Record<Department, "DISPATCHER" | "TRACKING" | "HR"> = {
  DISPATCH: "DISPATCHER",
  TRACKING: "TRACKING",
  HR: "HR",
};

export default async function AdminOverviewPage() {
  const { scope } = await requireAdminScope();

  // A department admin's figures only count their own department.
  const traineeRoles = scope
    ? [ROLE_FOR_DEPARTMENT[scope]]
    : (["DISPATCHER", "TRACKING", "HR"] as const);
  const moduleWhere = scope ? { department: scope } : {};

  const [traineeCount, moduleCount, publishedModules, attempts, resourceCount, trainees] =
    await Promise.all([
      prisma.user.count({ where: { role: { in: [...traineeRoles] } } }),
      prisma.module.count({ where: moduleWhere }),
      prisma.module.groupBy({
        by: ["department"],
        where: { published: true, ...moduleWhere },
        _count: { _all: true },
      }),
      prisma.quizAttempt.count({ where: { user: { role: { in: [...traineeRoles] } } } }),
      prisma.resource.count(),
      prisma.user.findMany({
        where: { role: { in: [...traineeRoles] } },
        include: { progress: true },
      }),
    ]);

  const publishedByDepartment: Record<Department, number> = {
    DISPATCH: 0,
    TRACKING: 0,
    HR: 0,
  };
  for (const row of publishedModules) {
    publishedByDepartment[row.department] = row._count._all;
  }
  const publishedTotal = Object.values(publishedByDepartment).reduce((a, b) => a + b, 0);

  const fullyCompleted = trainees.filter((t) => {
    const dept = departmentForRole(t.role);
    const total = dept ? publishedByDepartment[dept] : 0;
    return total > 0 && t.progress.length >= total;
  }).length;

  const stats = [
    { label: "Trainees", value: traineeCount },
    { label: "Published modules", value: `${publishedTotal} / ${moduleCount}` },
    { label: "Quiz attempts", value: attempts },
    { label: "Fully certified", value: fullyCompleted },
    { label: "Resource files", value: resourceCount },
  ];

  const departmentCounts: { department: Department; count: number }[] = (
    ["DISPATCH", "TRACKING", "HR"] as const
  ).map((department) => ({
    department,
    count: trainees.filter((t) => departmentForRole(t.role) === department).length,
  }));

  const recentTrainees = [...trainees]
    .sort((a, b) => b.progress.length - a.progress.length)
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-content">Admin overview</h1>
          <p className="text-content-muted">
            Manage onboarding content and track trainee progress across departments.
          </p>
        </div>
        <div className="flex gap-3">
          <LinkButton href="/admin/modules/new" variant="navy">
            + New module
          </LinkButton>
          <LinkButton href="/admin/trainees/new" variant="primary">
            + New trainee
          </LinkButton>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-2xl font-bold text-content">{s.value}</div>
            <div className="text-sm text-content-muted">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {departmentCounts.map(({ department, count }) => (
          <Link key={department} href={`/admin/trainees?department=${department}`}>
            <Card className="p-5 hover:border-accent-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <Badge tone={DEPARTMENT_TONE[department]}>{DEPARTMENT_LABELS[department]}</Badge>
                <span className="text-xs text-content-muted">
                  {publishedByDepartment[department]} published module
                  {publishedByDepartment[department] === 1 ? "" : "s"}
                </span>
              </div>
              <div className="text-2xl font-bold text-content">{count}</div>
              <div className="text-sm text-content-muted">trainee{count === 1 ? "" : "s"}</div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-content">Trainee progress</h2>
          <Link
            href="/admin/trainees"
            className="text-sm text-accent-600 font-medium hover:underline"
          >
            View all →
          </Link>
        </div>
        {recentTrainees.length === 0 ? (
          <p className="text-sm text-content-muted">
            No trainee accounts yet. Create one to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-content-muted border-b border-border-subtle">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Department</th>
                <th className="py-2 font-medium">Modules complete</th>
              </tr>
            </thead>
            <tbody>
              {recentTrainees.map((t) => {
                const dept = departmentForRole(t.role) ?? "DISPATCH";
                const total = publishedByDepartment[dept];
                return (
                  <tr key={t.id} className="border-b border-border-subtle last:border-0">
                    <td className="py-2.5">
                      <Link
                        href={`/admin/trainees/${t.id}`}
                        className="font-medium text-content hover:text-accent-600"
                      >
                        {t.name}
                      </Link>
                    </td>
                    <td className="py-2.5 text-content-muted">{t.email}</td>
                    <td className="py-2.5">
                      <Badge tone={DEPARTMENT_TONE[dept]}>{DEPARTMENT_LABELS[dept]}</Badge>
                    </td>
                    <td className="py-2.5 text-content-muted">
                      {t.progress.length} / {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
