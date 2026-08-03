"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getDispatcherProgress } from "@/lib/progress";

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
      audioLesson: { select: { id: true } },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  if (quiz.module) {
    const { modules } = await getDispatcherProgress(user.id);
    const routeStatus = modules.find((m) => m.slug === quiz.module!.slug)?.status;
    if (routeStatus === "locked") {
      throw new Error("Complete the previous stop before taking this quiz.");
    }
  }

  const results: QuizResult["results"] = {};
  let correctCount = 0;

  for (const question of quiz.questions) {
    const submitted = (answers[question.id] ?? "").trim();
    let isCorrect: boolean;
    let correctOptionId = "";

    if (question.type === "FILL_BLANK") {
      const normalize = (s: string) => s.trim().toLowerCase();
      const match = question.options.find((o) => normalize(o.text) === normalize(submitted));
      isCorrect = !!match;
      correctOptionId = match?.id ?? "";
    } else {
      const correctOption = question.options.find((o) => o.isCorrect);
      isCorrect = !!correctOption && submitted === correctOption.id;
      correctOptionId = correctOption?.id ?? "";
    }

    if (isCorrect) correctCount++;
    results[question.id] = { correct: isCorrect, correctOptionId };
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

  if (passed && quiz.module) {
    await prisma.moduleProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: quiz.module.id } },
      update: {},
      create: { userId: user.id, moduleId: quiz.module.id },
    });
  }

  revalidatePath("/dashboard");
  if (quiz.module) {
    revalidatePath(`/training/${quiz.module.slug}`);
  } else if (quiz.audioLesson) {
    revalidatePath("/audio");
    revalidatePath(`/audio/${quiz.audioLesson.id}`);
  }
  revalidatePath(`/quiz/${quiz.id}`);

  return { score, passed, correctCount, totalQuestions, passPercent: quiz.passPercent, results };
}
