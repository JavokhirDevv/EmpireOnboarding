import { notFound } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { QuizRunner } from "./quiz-runner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;
  await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      module: { select: { slug: true, title: true } },
      questions: {
        orderBy: { order: "asc" },
        include: { options: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!quiz) {
    notFound();
  }

  // Strip isCorrect before sending to the client — grading happens server-side.
  const safeQuestions = quiz.questions.map((q) => ({
    id: q.id,
    text: q.text,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
  }));

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <QuizRunner
        quizId={quiz.id}
        quizTitle={quiz.title}
        moduleSlug={quiz.module.slug}
        moduleTitle={quiz.module.title}
        passPercent={quiz.passPercent}
        questions={safeQuestions}
      />
    </div>
  );
}
