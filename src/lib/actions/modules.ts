"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const ModuleSchema = z.object({
  title: z.string().min(2),
  category: z.string().min(2),
  summary: z.string().min(2),
  content: z.string().min(2),
  order: z.coerce.number().int().default(0),
  estMinutes: z.coerce.number().int().min(1).default(10),
  published: z.coerce.boolean().default(false),
});

export async function createModule(formData: FormData) {
  await requireAdmin();

  const parsed = ModuleSchema.parse({
    title: formData.get("title"),
    category: formData.get("category"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    order: formData.get("order") || 0,
    estMinutes: formData.get("estMinutes") || 10,
    published: formData.get("published") === "on",
  });

  let slug = slugify(parsed.title);
  const existing = await prisma.module.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
  }

  const created = await prisma.module.create({
    data: { ...parsed, slug },
  });

  revalidatePath("/admin/modules");
  revalidatePath("/dashboard");
  redirect(`/admin/modules/${created.id}`);
}

export async function updateModule(moduleId: string, formData: FormData) {
  await requireAdmin();

  const parsed = ModuleSchema.parse({
    title: formData.get("title"),
    category: formData.get("category"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    order: formData.get("order") || 0,
    estMinutes: formData.get("estMinutes") || 10,
    published: formData.get("published") === "on",
  });

  const current = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!current) throw new Error("Module not found");

  await prisma.module.update({
    where: { id: moduleId },
    data: parsed,
  });

  revalidatePath("/admin/modules");
  revalidatePath(`/admin/modules/${moduleId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/training/${current.slug}`);
  redirect(`/admin/modules/${moduleId}`);
}

export async function deleteModule(moduleId: string) {
  await requireAdmin();
  await prisma.module.delete({ where: { id: moduleId } });
  revalidatePath("/admin/modules");
  revalidatePath("/dashboard");
  redirect("/admin/modules");
}

const QuizMetaSchema = z.object({
  title: z.string().min(2),
  passPercent: z.coerce.number().int().min(1).max(100).default(80),
});

export async function upsertQuizMeta(moduleId: string, formData: FormData) {
  await requireAdmin();

  const parsed = QuizMetaSchema.parse({
    title: formData.get("title"),
    passPercent: formData.get("passPercent") || 80,
  });

  await prisma.quiz.upsert({
    where: { moduleId },
    update: parsed,
    create: { moduleId, ...parsed },
  });

  revalidatePath(`/admin/modules/${moduleId}`);
  redirect(`/admin/modules/${moduleId}`);
}

const QuestionSchema = z.object({
  text: z.string().min(2),
  optionTexts: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.coerce.number().int().min(0),
});

export async function addQuestion(quizId: string, formData: FormData) {
  await requireAdmin();

  const optionTexts = formData.getAll("optionText").map(String);
  const parsed = QuestionSchema.parse({
    text: formData.get("text"),
    optionTexts,
    correctIndex: formData.get("correctIndex"),
  });

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { module: { select: { id: true } }, questions: true },
  });
  if (!quiz) throw new Error("Quiz not found");

  await prisma.question.create({
    data: {
      quizId,
      text: parsed.text,
      order: quiz.questions.length,
      options: {
        create: parsed.optionTexts.map((text, i) => ({
          text,
          isCorrect: i === parsed.correctIndex,
          order: i,
        })),
      },
    },
  });

  revalidatePath(`/admin/modules/${quiz.module.id}`);
  redirect(`/admin/modules/${quiz.module.id}`);
}

export async function deleteQuestion(questionId: string) {
  await requireAdmin();
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { quiz: { select: { moduleId: true } } },
  });
  if (!question) return;

  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath(`/admin/modules/${question.quiz.moduleId}`);
  redirect(`/admin/modules/${question.quiz.moduleId}`);
}
