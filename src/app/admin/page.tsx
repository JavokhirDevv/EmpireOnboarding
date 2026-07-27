import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, LinkButton } from "@/components/ui";

export default async function AdminOverviewPage() {
  const [dispatcherCount, moduleCount, publishedCount, attempts, resourceCount, dispatchers] =
    await Promise.all([
      prisma.user.count({ where: { role: "DISPATCHER" } }),
      prisma.module.count(),
      prisma.module.count({ where: { published: true } }),
      prisma.quizAttempt.count(),
      prisma.resource.count(),
      prisma.user.findMany({
        where: { role: "DISPATCHER" },
        include: { progress: true },
      }),
    ]);

  const fullyCompleted = dispatchers.filter(
    (d) => publishedCount > 0 && d.progress.length >= publishedCount
  ).length;

  const stats = [
    { label: "Dispatchers", value: dispatcherCount },
    { label: "Published modules", value: `${publishedCount} / ${moduleCount}` },
    { label: "Quiz attempts", value: attempts },
    { label: "Fully certified", value: fullyCompleted },
    { label: "Resource files", value: resourceCount },
  ];

  const recentDispatchers = [...dispatchers]
    .sort((a, b) => b.progress.length - a.progress.length)
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Admin overview</h1>
          <p className="text-steel-500">
            Manage onboarding content and track dispatcher progress.
          </p>
        </div>
        <div className="flex gap-3">
          <LinkButton href="/admin/modules/new" variant="navy">
            + New module
          </LinkButton>
          <LinkButton href="/admin/trainees/new" variant="primary">
            + New dispatcher
          </LinkButton>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="text-2xl font-bold text-navy-900">{s.value}</div>
            <div className="text-sm text-steel-500">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-navy-900">Dispatcher progress</h2>
          <Link
            href="/admin/trainees"
            className="text-sm text-accent-600 font-medium hover:underline"
          >
            View all →
          </Link>
        </div>
        {recentDispatchers.length === 0 ? (
          <p className="text-sm text-steel-500">
            No dispatcher accounts yet. Create one to get started.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-steel-500 border-b border-border-subtle">
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Modules complete</th>
              </tr>
            </thead>
            <tbody>
              {recentDispatchers.map((d) => (
                <tr key={d.id} className="border-b border-border-subtle last:border-0">
                  <td className="py-2.5">
                    <Link
                      href={`/admin/trainees/${d.id}`}
                      className="font-medium text-navy-900 hover:text-accent-600"
                    >
                      {d.name}
                    </Link>
                  </td>
                  <td className="py-2.5 text-steel-500">{d.email}</td>
                  <td className="py-2.5 text-steel-500">
                    {d.progress.length} / {publishedCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
