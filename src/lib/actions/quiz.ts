"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export type QuizResult = {
  score: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  passPercent: number;
  results: Record<string, { correct: boolean; correctOptionId: string }>;
};

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, string>
): Promise<QuizResult> {
  const user = await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { include: { options: true }, orderBy: { order: "asc" } },
      module: { select: { id: true, slug: true } },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const results: QuizResult["results"] = {};
  let correctCount = 0;

  for (const question of quiz.questions) {
    const correctOption = question.options.find((o) => o.isCorrect);
    const submittedOptionId = answers[question.id];
    const isCorrect = !!correctOption && submittedOptionId === correctOption.id;
    if (isCorrect) correctCount++;
    results[question.id] = {
      correct: isCorrect,
      correctOptionId: correctOption?.id ?? "",
    };
  }

  const totalQuestions = quiz.questions.length;
  const score =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quiz.passPercent;

  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      score,
      passed,
      answers: JSON.stringify(answers),
    },
  });

  if (passed) {
    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: quiz.module.id } },
      update: {},
      create: { userId: user.id, moduleId: quiz.module.id },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath(`/training/${quiz.module.slug}`);
  revalidatePath(`/quiz/${quiz.id}`);

  return { score, passed, correctCount, totalQuestions, passPercent: quiz.passPercent, results };
}
