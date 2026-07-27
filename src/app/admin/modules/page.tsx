import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Card, LinkButton } from "@/components/ui";

export default async function AdminModulesPage() {
  const modules = await prisma.module.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { quiz: { include: { questions: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Training modules</h1>
          <p className="text-steel-500">
            Create and manage onboarding content and quizzes.
          </p>
        </div>
        <LinkButton href="/admin/modules/new" variant="primary">
          + New module
        </LinkButton>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
              <th className="py-3 px-5 font-medium">Title</th>
              <th className="py-3 px-5 font-medium">Category</th>
              <th className="py-3 px-5 font-medium">Order</th>
              <th className="py-3 px-5 font-medium">Quiz</th>
              <th className="py-3 px-5 font-medium">Status</th>
              <th className="py-3 px-5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m.id} className="border-b border-border-subtle last:border-0 hover:bg-surface-muted">
                <td className="py-3 px-5">
                  <Link
                    href={`/admin/modules/${m.id}`}
                    className="font-medium text-navy-900 hover:text-accent-600"
                  >
                    {m.title}
                  </Link>
                </td>
                <td className="py-3 px-5 text-steel-500">{m.category}</td>
                <td className="py-3 px-5 text-steel-500">{m.order}</td>
                <td className="py-3 px-5 text-steel-500">
                  {m.quiz ? `${m.quiz.questions.length} questions` : "—"}
                </td>
                <td className="py-3 px-5">
                  {m.published ? (
                    <Badge tone="success">Published</Badge>
                  ) : (
                    <Badge tone="steel">Draft</Badge>
                  )}
                </td>
                <td className="py-3 px-5 text-right">
                  <LinkButton
                    href={`/admin/modules/${m.id}`}
                    variant="outline"
                    className="text-xs px-3 py-1.5"
                  >
                    Edit
                  </LinkButton>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-steel-500">
                  No modules yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
