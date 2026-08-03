import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteUser } from "@/lib/actions/users";
import { Badge, Button, Card } from "@/components/ui";

export default async function TraineeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dispatcher = await prisma.user.findUnique({
    where: { id },
    include: {
      progress: { include: { module: true } },
      attempts: {
        include: { quiz: { include: { module: true, audioLesson: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dispatcher || dispatcher.role !== "DISPATCHER") notFound();

  const modules = await prisma.module.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  const completedModuleIds = new Set(dispatcher.progress.map((p) => p.moduleId));
  const deleteUserWithId = deleteUser.bind(null, dispatcher.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{dispatcher.name}</h1>
          <p className="text-steel-500">{dispatcher.email}</p>
          {dispatcher.title && (
            <p className="text-sm text-steel-500 mt-1">{dispatcher.title}</p>
          )}
        </div>
        <form action={deleteUserWithId}>
          <Button type="submit" variant="danger" className="text-xs px-3 py-1.5">
            Remove account
          </Button>
        </form>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-navy-900 mb-4">
          Module completion ({completedModuleIds.size}/{modules.length})
        </h2>
        <ul className="space-y-2">
          {modules.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between text-sm border-b border-border-subtle last:border-0 py-2"
            >
              <span className="text-navy-800">{m.title}</span>
              {completedModuleIds.has(m.id) ? (
                <Badge tone="success">Complete</Badge>
              ) : (
                <Badge tone="steel">Not started</Badge>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-navy-900 mb-4">Quiz attempt history</h2>
        {dispatcher.attempts.length === 0 ? (
          <p className="text-sm text-steel-500">No quiz attempts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-steel-500 border-b border-border-subtle">
                <th className="py-2 font-medium">Quiz</th>
                <th className="py-2 font-medium">Score</th>
                <th className="py-2 font-medium">Result</th>
                <th className="py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {dispatcher.attempts.map((a) => (
                <tr key={a.id} className="border-b border-border-subtle last:border-0">
                  <td className="py-2.5 text-navy-800">
                    {a.quiz.module?.title ?? a.quiz.audioLesson?.title}
                    {a.quiz.audioLesson && (
                      <span className="ml-2 text-xs text-steel-500">(Audio)</span>
                    )}
                  </td>
                  <td className="py-2.5 text-steel-500">{a.score}%</td>
                  <td className="py-2.5">
                    {a.passed ? (
                      <Badge tone="success">Passed</Badge>
                    ) : (
                      <Badge tone="danger">Failed</Badge>
                    )}
                  </td>
                  <td className="py-2.5 text-steel-500">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(a.createdAt)}
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
