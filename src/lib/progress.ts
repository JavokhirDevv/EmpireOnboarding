import "server-only";
import { prisma } from "@/lib/prisma";
import type { Department } from "@/generated/prisma/enums";

export { DEPARTMENT_LABELS, departmentForRole } from "@/lib/departments";

export type ModuleStatus = "completed" | "current" | "locked";

export async function getTraineeProgress(userId: string, department: Department) {
  const modules = await prisma.module.findMany({
    where: { published: true, department },
    orderBy: { order: "asc" },
    include: {
      quiz: { select: { id: true, title: true, passPercent: true } },
      progress: { where: { userId } },
    },
  });

  let currentAssigned = false;
  const enriched = modules.map((m) => {
    const completed = m.progress.length > 0;
    let status: ModuleStatus;
    if (completed) {
      status = "completed";
    } else if (!currentAssigned) {
      status = "current";
      currentAssigned = true;
    } else {
      status = "locked";
    }

    return {
      id: m.id,
      slug: m.slug,
      title: m.title,
      category: m.category,
      summary: m.summary,
      estMinutes: m.estMinutes,
      order: m.order,
      quiz: m.quiz,
      completed,
      completedAt: m.progress[0]?.completedAt ?? null,
      status,
    };
  });

  const total = enriched.length;
  const completed = enriched.filter((m) => m.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const allComplete = total > 0 && completed === total;

  return {
    modules: enriched,
    total,
    completed,
    percent,
    allComplete,
    certificateUnlocked: allComplete,
  };
}

export async function getLatestAttempt(userId: string, quizId: string) {
  return prisma.quizAttempt.findFirst({
    where: { userId, quizId },
    orderBy: { createdAt: "desc" },
  });
}
