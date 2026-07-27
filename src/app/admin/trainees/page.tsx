import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, LinkButton, ProgressBar } from "@/components/ui";

export default async function TraineesPage() {
  const [dispatchers, publishedCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: "DISPATCHER" },
      include: { progress: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.module.count({ where: { published: true } }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Dispatchers</h1>
          <p className="text-steel-500">
            Every account with access to the onboarding platform.
          </p>
        </div>
        <LinkButton href="/admin/trainees/new" variant="primary">
          + New dispatcher
        </LinkButton>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
              <th className="py-3 px-5 font-medium">Name</th>
              <th className="py-3 px-5 font-medium">Email</th>
              <th className="py-3 px-5 font-medium w-56">Progress</th>
            </tr>
          </thead>
          <tbody>
            {dispatchers.map((d) => {
              const percent =
                publishedCount === 0
                  ? 0
                  : Math.round((d.progress.length / publishedCount) * 100);
              return (
                <tr
                  key={d.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-surface-muted"
                >
                  <td className="py-3 px-5">
                    <Link
                      href={`/admin/trainees/${d.id}`}
                      className="font-medium text-navy-900 hover:text-accent-600"
                    >
                      {d.name}
                    </Link>
                  </td>
                  <td className="py-3 px-5 text-steel-500">{d.email}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar percent={percent} />
                      </div>
                      <span className="text-xs text-steel-500 w-16 text-right">
                        {d.progress.length}/{publishedCount}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {dispatchers.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-steel-500">
                  No dispatcher accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
