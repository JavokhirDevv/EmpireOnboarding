"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_BYTES,
  deleteUploadedFile,
  saveUploadedFile,
} from "@/lib/storage";
import { parseQuestionFormData, questionCreateData } from "@/lib/quiz-question-schema";

const AudioMetaSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  durationLabel: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(false),
});

export type AudioFormState = { error?: string } | undefined;

export async function createAudioLesson(
  _prevState: AudioFormState,
  formData: FormData
): Promise<AudioFormState> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an audio file to upload." };
  }
  if (!(file.type in ALLOWED_AUDIO_TYPES)) {
    return { error: "Only MP3, WAV, M4A, AAC, OGG, or WEBM audio files are allowed." };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return { error: "File is too large — the limit is 60MB." };
  }

  const parsed = AudioMetaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    durationLabel: formData.get("durationLabel") || undefined,
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const storedName = await saveUploadedFile(file, ALLOWED_AUDIO_TYPES);

  const created = await prisma.audioLesson.create({
    data: {
      ...parsed.data,
      fileName: file.name,
      storedName,
      mimeType: file.type,
      sizeBytes: file.size,
    },
  });

  revalidatePath("/admin/audio");
  revalidatePath("/audio");
  redirect(`/admin/audio/${created.id}`);
}

const AudioUpdateSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  durationLabel: z.string().optional(),
  order: z.coerce.number().int().default(0),
  published: z.coerce.boolean().default(false),
});

export async function updateAudioLesson(audioLessonId: string, formData: FormData) {
  await requireAdmin();

  const parsed = AudioUpdateSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    durationLabel: formData.get("durationLabel") || undefined,
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });

  await prisma.audioLesson.update({
    where: { id: audioLessonId },
    data: parsed,
  });

  revalidatePath("/admin/audio");
  revalidatePath(`/admin/audio/${audioLessonId}`);
  revalidatePath("/audio");
  revalidatePath(`/audio/${audioLessonId}`);
  redirect(`/admin/audio/${audioLessonId}`);
}

export async function deleteAudioLesson(audioLessonId: string) {
  await requireAdmin();

  const lesson = await prisma.audioLesson.findUnique({ where: { id: audioLessonId } });
  if (!lesson) return;

  await prisma.audioLesson.delete({ where: { id: audioLessonId } });
  await deleteUploadedFile(lesson.storedName);

  revalidatePath("/admin/audio");
  revalidatePath("/audio");
  redirect("/admin/audio");
}

const QuizMetaSchema = z.object({
  title: z.string().min(2),
  passPercent: z.coerce.number().int().min(1).max(100).default(80),
});

export async function upsertAudioQuizMeta(audioLessonId: string, formData: FormData) {
  await requireAdmin();

  const parsed = QuizMetaSchema.parse({
    title: formData.get("title"),
    passPercent: formData.get("passPercent") || 80,
  });

  await prisma.quiz.upsert({
    where: { audioLessonId },
    update: parsed,
    create: { audioLessonId, ...parsed },
  });

  revalidatePath(`/admin/audio/${audioLessonId}`);
  redirect(`/admin/audio/${audioLessonId}`);
}

export async function addAudioQuestion(quizId: string, formData: FormData) {
  await requireAdmin();

  const input = parseQuestionFormData(formData);

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { audioLesson: { select: { id: true } }, questions: true },
  });
  if (!quiz || !quiz.audioLesson) throw new Error("Audio quiz not found");

  await prisma.question.create({
    data: {
      quizId,
      ...questionCreateData(input, quiz.questions.length),
    },
  });

  revalidatePath(`/admin/audio/${quiz.audioLesson.id}`);
  redirect(`/admin/audio/${quiz.audioLesson.id}`);
}

export async function deleteAudioQuestion(questionId: string) {
  await requireAdmin();
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { quiz: { select: { audioLessonId: true } } },
  });
  if (!question || !question.quiz.audioLessonId) return;

  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath(`/admin/audio/${question.quiz.audioLessonId}`);
  redirect(`/admin/audio/${question.quiz.audioLessonId}`);
}
