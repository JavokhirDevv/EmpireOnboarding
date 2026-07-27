"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

export async function markModuleComplete(moduleId: string) {
  const user = await requireUser();

  const moduleWithQuiz = await prisma.module.findUnique({
    where: { id: moduleId },
    select: { id: true, slug: true, quiz: { select: { id: true } } },
  });

  if (!moduleWithQuiz) return;
  if (moduleWithQuiz.quiz) {
    // Modules with a quiz are only completed by passing the quiz.
    return;
  }

  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: user.id, moduleId } },
    update: {},
    create: { userId: user.id, moduleId },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/training/${moduleWithQuiz.slug}`);
}

export async function resetProgress() {
  const user = await requireUser();

  await prisma.$transaction([
    prisma.moduleProgress.deleteMany({ where: { userId: user.id } }),
    prisma.quizAttempt.deleteMany({ where: { userId: user.id } }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/certificate");
  redirect("/dashboard");
}
