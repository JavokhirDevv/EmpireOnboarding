import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getDispatcherProgress } from "@/lib/progress";
import { QuizRunner } from "./quiz-runner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  const user = await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      module: { select: { slug: true, title: true } },
      audioLesson: { select: { id: true, title: true } },
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!quiz || (!quiz.module && !quiz.audioLesson)) {
    notFound();
  }

  let backHref: string;
  let contentTitle: string;
  let resultsHomeHref: string;
  let resultsHomeLabel: string;

  if (quiz.module) {
    const { modules } = await getDispatcherProgress(user.id);
    const routeStatus = modules.find((m) => m.slug === quiz.module!.slug)?.status;
    if (routeStatus === "locked") {
      redirect("/dashboard");
    }
    backHref = `/training/${quiz.module.slug}`;
    contentTitle = quiz.module.title;
    resultsHomeHref = "/dashboard";
    resultsHomeLabel = "Back to training";
  } else {
    backHref = `/audio/${quiz.audioLesson!.id}`;
    contentTitle = quiz.audioLesson!.title;
    resultsHomeHref = "/audio";
    resultsHomeLabel = "Back to audio training";
  }

  // Strip answers before sending to the client — grading happens server-side.
  // FILL_BLANK questions get no options at all (they'd just be the accepted answers).
  const safeQuestions = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    type: q.type,
    options: q.type === "FILL_BLANK" ? [] : q.options.map((o) => ({ id: o.id, text: o.text })),
  }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <QuizRunner
        quizId={quiz.id}
        quizTitle={quiz.title}
        contentTitle={contentTitle}
        backHref={backHref}
        resultsHomeHref={resultsHomeHref}
        resultsHomeLabel={resultsHomeLabel}
        passPercent={quiz.passPercent}
        questions={safeQuestions}
      />
    </div>
  );
}
