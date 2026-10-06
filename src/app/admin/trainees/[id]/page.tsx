import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminScope } from "@/lib/dal";
import { deleteUser } from "@/lib/actions/users";
import { Badge, Button, Card } from "@/components/ui";
import { DEPARTMENT_LABELS, departmentForRole } from "@/lib/progress";
import { EditTraineeForm } from "./edit-trainee-form";
import { QuizResultDownload } from "@/components/quiz-result-download";

export default async function TraineeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { scope } = await requireAdminScope();
  const { id } = await params;

  const trainee = await prisma.user.findUnique({
    where: { id },
    include: {
      progress: { include: { module: true } },
      attempts: {
        include: { quiz: { include: { module: true, audioLesson: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const department = trainee ? departmentForRole(trainee.role) : null;
  if (!trainee || !department) notFound();
  if (scope && department !== scope) notFound();

  const modules = await prisma.module.findMany({
    where: { published: true, department },
    orderBy: { order: "asc" },
  });

  const completedModuleIds = new Set(trainee.progress.map((p) => p.moduleId));
  const deleteUserWithId = deleteUser.bind(null, trainee.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold text-content">{trainee.name}</h1>
            <Badge tone="accent">{DEPARTMENT_LABELS[department]}</Badge>
          </div>
          <p className="text-content-muted">{trainee.email}</p>
          {trainee.title && (
            <p className="text-sm text-content-muted mt-1">{trainee.title}</p>
          )}
        </div>
        <form action={deleteUserWithId}>
          <Button type="submit" variant="danger" className="text-xs px-3 py-1.5">
            Remove account
          </Button>
        </form>
      </div>

      <Card className="p-6 max-w-lg">
        <h2 className="font-semibold text-content mb-4">Edit trainee</h2>
        <EditTraineeForm
          userId={trainee.id}
          name={trainee.name}
          title={trainee.title}
        />
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-content mb-4">
          Module completion ({completedModuleIds.size}/{modules.length})
        </h2>
        <ul className="space-y-2">
          {modules.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between text-sm border-b border-border-subtle last:border-0 py-2"
            >
              <span className="text-content-soft">{m.title}</span>
              {completedModuleIds.has(m.id) ? (
                <Badge tone="success">Complete</Badge>
              ) : (
                <Badge tone="steel">Not started</Badge>
              )}
            </li>
          ))}
          {modules.length === 0 && (
            <p className="text-sm text-content-muted">No published modules for this department yet.</p>
          )}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold text-content mb-4">Quiz attempt history</h2>
        {trainee.attempts.length === 0 ? (
          <p className="text-sm text-content-muted">No quiz attempts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-content-muted border-b border-border-subtle">
                <th className="py-2 font-medium">Quiz</th>
                <th className="py-2 font-medium">Score</th>
                <th className="py-2 font-medium">Result</th>
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium text-right">Answers</th>
              </tr>
            </thead>
            <tbody>
              {trainee.attempts.map((a) => (
                <tr key={a.id} className="border-b border-border-subtle last:border-0">
                  <td className="py-2.5 text-content-soft">
                    {a.quiz.module?.title ?? a.quiz.audioLesson?.title}
                    {a.quiz.audioLesson && (
                      <span className="ml-2 text-xs text-content-muted">(Audio)</span>
                    )}
                  </td>
                  <td className="py-2.5 text-content-muted">{a.score}%</td>
                  <td className="py-2.5">
                    {a.passed ? (
                      <Badge tone="success">Passed</Badge>
                    ) : (
                      <Badge tone="danger">Failed</Badge>
                    )}
                  </td>
                  <td className="py-2.5 text-content-muted">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(a.createdAt)}
                  </td>
                  <td className="py-2.5 text-right">
                    <QuizResultDownload
                      attemptId={a.id}
                      label="PDF"
                      variant="outline"
                      className="text-xs px-3 py-1.5"
                    />
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
