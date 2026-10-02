import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getTraineeProgress, departmentForRole, getLatestAttempt } from "@/lib/progress";
import { Badge, Card, LinkButton } from "@/components/ui";
import { MarkCompleteButton } from "./mark-complete-button";

export default async function TrainingModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();
  const department = departmentForRole(user.role);
  if (!department) redirect("/admin");

  const trainingModule = await prisma.module.findUnique({
    where: { slug },
    include: {
      quiz: { select: { id: true, title: true, passPercent: true } },
      progress: { where: { userId: user.id } },
    },
  });

  if (!trainingModule || !trainingModule.published || trainingModule.department !== department) {
    notFound();
  }

  const { modules } = await getTraineeProgress(user.id, department);
  const routeIndex = modules.findIndex((m) => m.slug === slug);
  const routeStatus = modules[routeIndex]?.status;
  if (routeStatus === "locked") {
    redirect("/dashboard");
  }

  const previousStop = routeIndex > 0 ? modules[routeIndex - 1] : null;
  const nextStop = routeIndex >= 0 ? modules[routeIndex + 1] : null;

  const completed = trainingModule.progress.length > 0;

  // Most recent attempt, shown as a score line under the quiz CTA.
  const latestAttempt = trainingModule.quiz
    ? await getLatestAttempt(user.id, trainingModule.quiz.id)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-steel-500 hover:text-navy-800 mb-5 inline-flex items-center gap-1.5"
      >
        ← Back to your route
      </Link>

      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-600">
          Stop {routeIndex + 1} of {modules.length}
        </span>
        <span className="h-3 w-px bg-border-subtle" />
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-500">
          {trainingModule.category}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-3xl font-bold text-navy-900">
          {trainingModule.title}
        </h1>
        {completed && <Badge tone="success">Completed</Badge>}
      </div>
      <p className="text-steel-500 mb-8 max-w-xl">{trainingModule.summary}</p>

      <Card className="overflow-hidden mb-6">
        <div className="h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-navy-600" />
        <div className="prose-training p-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {trainingModule.content}
          </ReactMarkdown>
        </div>
      </Card>

      <Card className="p-6 flex items-center justify-between flex-wrap gap-4 border-accent-400/30 bg-accent-100/50">
        {trainingModule.quiz ? (
          <>
            <div>
              <div className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-1">
                {completed ? "Knowledge check" : "Next: knowledge check"}
              </div>
              <div className="font-semibold text-navy-900">
                {trainingModule.quiz.title}
              </div>
              <div className="text-sm text-steel-500">
                Score {trainingModule.quiz.passPercent}% or higher to complete this
                stop.
                {latestAttempt && <> Last attempt: {latestAttempt.score}%.</>}
              </div>
            </div>
            <LinkButton href={`/quiz/${trainingModule.quiz.id}`} variant="primary">
              {completed ? "Retake quiz" : "Take quiz"}
            </LinkButton>
          </>
        ) : (
          <>
            <div>
              <div className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-1">
                {completed ? "Done" : "Next step"}
              </div>
              <div className="font-semibold text-navy-900">
                {completed
                  ? "You've marked this stop complete."
                  : "Mark it complete when you're done reading."}
              </div>
            </div>
            {!completed && <MarkCompleteButton moduleId={trainingModule.id} />}
          </>
        )}
      </Card>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {previousStop ? (
          <Link href={`/training/${previousStop.slug}`}>
            <Card className="p-4 hover:border-accent-400 transition-colors h-full">
              <div className="text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">
                ← Previous
              </div>
              <div className="text-sm font-semibold text-navy-900">
                {previousStop.title}
              </div>
            </Card>
          </Link>
        ) : (
          <span />
        )}

        {nextStop && nextStop.status !== "locked" ? (
          <Link href={`/training/${nextStop.slug}`}>
            <Card className="p-4 hover:border-accent-400 transition-colors h-full text-right">
              <div className="text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">
                Next →
              </div>
              <div className="text-sm font-semibold text-navy-900">
                {nextStop.title}
              </div>
            </Card>
          </Link>
        ) : nextStop ? (
          <Card className="p-4 h-full text-right opacity-60">
            <div className="text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">
              Next →
            </div>
            <div className="text-sm font-semibold text-steel-500">
              {nextStop.title}
              <span className="block text-xs font-normal mt-0.5">
                Unlocks after this stop
              </span>
            </div>
          </Card>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
