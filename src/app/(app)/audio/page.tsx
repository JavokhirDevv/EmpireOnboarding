import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";

export default async function AudioTrainingPage() {
  const user = await requireUser();

  const lessons = await prisma.audioLesson.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: {
      quiz: {
        include: { attempts: { where: { userId: user.id }, orderBy: { createdAt: "desc" } } },
      },
    },
  });

  const completedCount = lessons.filter((l) =>
    l.quiz?.attempts.some((a) => a.passed)
  ).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        Listening
      </span>
      <h1 className="text-3xl font-bold text-navy-900 mt-1">Audio Training</h1>
      <p className="text-steel-500 mt-2 max-w-lg">
        Real recordings from the floor — listen, then pass a short quiz to
        confirm what you picked up. These aren&apos;t part of your onboarding
        route, so listen in any order.
      </p>

      {lessons.length > 0 && (
        <p className="text-sm text-steel-500 mt-4">
          {completedCount} of {lessons.length} quizzes passed
        </p>
      )}

      <div className="mt-6 space-y-3">
        {lessons.map((lesson) => {
          const passed = lesson.quiz?.attempts.some((a) => a.passed) ?? false;
          const attempted = (lesson.quiz?.attempts.length ?? 0) > 0;
          return (
            <Link key={lesson.id} href={`/audio/${lesson.id}`}>
              <Card className="p-5 hover:border-accent-400 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-1.5">
                  <h3 className="font-semibold text-navy-900">{lesson.title}</h3>
                  {passed ? (
                    <Badge tone="success">Passed</Badge>
                  ) : attempted ? (
                    <Badge tone="danger">Retry needed</Badge>
                  ) : lesson.durationLabel ? (
                    <Badge tone="steel">{lesson.durationLabel}</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-steel-500 leading-relaxed">
                  {lesson.description}
                </p>
                {lesson.quiz && (
                  <div className="text-xs text-accent-600 font-semibold mt-3">
                    Includes quiz · {lesson.quiz.passPercent}% to pass
                  </div>
                )}
              </Card>
            </Link>
          );
        })}

        {lessons.length === 0 && (
          <Card className="p-8 text-center text-steel-500">
            No audio lessons have been published yet. Check back soon.
          </Card>
        )}
      </div>
    </div>
  );
}
