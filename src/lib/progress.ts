import "server-only";
import { prisma } from "@/lib/prisma";

export async function getDispatcherProgress(userId: string) {
  const modules = await prisma.module.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      quiz: { select: { id: true, title: true, passPercent: true } },
      progress: { where: { userId } },
    },
  });

  const enriched = modules.map((m) => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    category: m.category,
    summary: m.summary,
    estMinutes: m.estMinutes,
    order: m.order,
    quiz: m.quiz,
    completed: m.progress.length > 0,
    completedAt: m.progress[0]?.completedAt ?? null,
  }));

  const total = enriched.length;
  const completed = enriched.filter((m) => m.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    modules: enriched,
    total,
    completed,
    percent,
    allComplete: total > 0 && completed === total,
  };
}

export async function getLatestAttempt(userId: string, quizId: string) {
  return prisma.quizAttempt.findFirst({
    where: { userId, quizId },
    orderBy: { createdAt: "desc" },
  });
}
