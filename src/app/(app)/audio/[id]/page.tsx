import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { departmentForRole } from "@/lib/progress";
import { Badge, Card, LinkButton } from "@/components/ui";
import { formatFileSize } from "@/lib/format";

export default async function AudioLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  if (departmentForRole(user.role) !== "DISPATCH") {
    redirect("/dashboard");
  }

  const lesson = await prisma.audioLesson.findUnique({
    where: { id },
    include: {
      quiz: {
        include: { attempts: { where: { userId: user.id }, orderBy: { createdAt: "desc" } } },
      },
    },
  });

  if (!lesson || !lesson.published) {
    notFound();
  }

  const passed = lesson.quiz?.attempts.some((a) => a.passed) ?? false;
  const latestAttempt = lesson.quiz?.attempts[0];

  return (
    <div className="stagger-children max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/audio"
        className="text-sm text-content-muted hover:text-content-soft mb-4 inline-block"
      >
        ← Back to audio training
      </Link>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-content">{lesson.title}</h1>
        {passed && <Badge tone="success">Passed</Badge>}
      </div>
      <p className="text-content-muted mb-6">{lesson.description}</p>

      <Card className="p-6 mb-8">
        <audio
          controls
          preload="metadata"
          className="w-full"
          src={`/api/audio/${lesson.id}`}
        />
        <div className="text-xs text-content-muted mt-2">
          {lesson.fileName} · {formatFileSize(lesson.sizeBytes)}
          {lesson.durationLabel ? ` · ${lesson.durationLabel}` : ""}
        </div>
      </Card>

      {lesson.quiz ? (
        <Card className="p-6 flex items-center justify-between flex-wrap gap-4 border-accent-400/30 bg-accent-100/50">
          <div>
            <div className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-1">
              {passed ? "Knowledge check" : "Next: knowledge check"}
            </div>
            <div className="font-semibold text-content">{lesson.quiz.title}</div>
            <div className="text-sm text-content-muted">
              Score {lesson.quiz.passPercent}% or higher to pass.
              {latestAttempt && <> Last attempt: {latestAttempt.score}%.</>}
            </div>
          </div>
          <LinkButton href={`/quiz/${lesson.quiz.id}`} variant="primary">
            {passed ? "Retake quiz" : "Take quiz"}
          </LinkButton>
        </Card>
      ) : (
        <Card className="p-6 text-content-muted text-sm">
          No quiz has been added for this recording yet.
        </Card>
      )}
    </div>
  );
}
