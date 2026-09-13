"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getTraineeProgress, departmentForRole } from "@/lib/progress";
import { gradeAnswer } from "@/lib/quiz-grading";

export type QuizResult = {
  attemptId: string;
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
  const department = departmentForRole(user.role);
  if (!department) {
    throw new Error("Quiz not found");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { include: { options: true }, orderBy: { order: "asc" } },
      module: { select: { id: true, slug: true, department: true } },
      audioLesson: { select: { id: true } },
    },
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // Module quizzes belong to whichever department authored the module;
  // audio-lesson quizzes are a Dispatch-only feature.
  if (quiz.module && quiz.module.department !== department) {
    throw new Error("Quiz not found");
  }
  if (quiz.audioLesson && department !== "DISPATCH") {
    throw new Error("Quiz not found");
  }

  if (quiz.module) {
    const { modules } = await getTraineeProgress(user.id, department);
    const routeStatus = modules.find((m) => m.slug === quiz.module!.slug)?.status;
    if (routeStatus === "locked") {
      throw new Error("Complete the previous stop before taking this quiz.");
    }
  }

  const results: QuizResult["results"] = {};
  let correctCount = 0;

  for (const question of quiz.questions) {
    const { correct: isCorrect, matched } = gradeAnswer(question, answers[question.id] ?? "");
    if (isCorrect) correctCount++;
    results[question.id] = { correct: isCorrect, correctOptionId: matched?.id ?? "" };
  }

  const totalQuestions = quiz.questions.length;
  const score =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
  const passed = score >= quiz.passPercent;

  const attempt = await prisma.quizAttempt.create({
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

  return {
    attemptId: attempt.id,
    score,
    passed,
    correctCount,
    totalQuestions,
    passPercent: quiz.passPercent,
    results,
  };
}
