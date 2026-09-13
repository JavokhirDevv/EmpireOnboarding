import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { correctAnswerLabel, gradeAnswer } from "@/lib/quiz-grading";
import { buildQuizResultPdf, type PdfAnswerRow } from "@/lib/quiz-result-pdf";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "trainee";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return new NextResponse(null, { status: 401 });
  }

  const { attemptId } = await params;
  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      user: { select: { id: true, name: true, email: true, title: true } },
      quiz: {
        include: {
          module: { select: { title: true } },
          audioLesson: { select: { title: true } },
          questions: {
            orderBy: { order: "asc" },
            include: { options: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });

  // Trainees can only print their own sheet; admins can print anyone's to pass
  // along to HR.
  if (!attempt || (attempt.userId !== session.userId && session.role !== "ADMIN")) {
    return new NextResponse(null, { status: 404 });
  }

  let submitted: Record<string, string> = {};
  try {
    submitted = JSON.parse(attempt.answers) as Record<string, string>;
  } catch {
    submitted = {};
  }

  const answers: PdfAnswerRow[] = attempt.quiz.questions.map((question, index) => {
    const given = submitted[question.id] ?? "";
    const { correct } = gradeAnswer(question, given);
    const givenAnswer =
      question.type === "FILL_BLANK"
        ? given
        : question.options.find((o) => o.id === given)?.text ?? "";

    return {
      number: index + 1,
      questionText: question.text.replace(/____/g, "__________"),
      givenAnswer,
      correctAnswer: correctAnswerLabel(question),
      correct,
    };
  });

  const correctCount = answers.filter((a) => a.correct).length;

  const pdf = await buildQuizResultPdf({
    traineeName: attempt.user.name,
    traineeEmail: attempt.user.email,
    traineeTitle: attempt.user.title,
    quizTitle: attempt.quiz.title,
    contentTitle: attempt.quiz.module?.title ?? attempt.quiz.audioLesson?.title ?? "Training",
    completedAt: attempt.createdAt,
    score: attempt.score,
    passPercent: attempt.quiz.passPercent,
    passed: attempt.passed,
    correctCount,
    totalQuestions: attempt.quiz.questions.length,
    answers,
  });

  const fileName = `quiz-result-${slugify(attempt.user.name)}-${slugify(attempt.quiz.title)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": String(pdf.byteLength),
      "Cache-Control": "private, no-store",
    },
  });
}
