import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Badge, Card, LinkButton } from "@/components/ui";
import { MarkCompleteButton } from "./mark-complete-button";

export default async function TrainingModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await requireUser();

  const trainingModule = await prisma.module.findUnique({
    where: { slug },
    include: {
      quiz: { select: { id: true, title: true, passPercent: true } },
      progress: { where: { userId: user.id } },
    },
  });

  if (!trainingModule || !trainingModule.published) {
    notFound();
  }

  const completed = trainingModule.progress.length > 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-steel-500 hover:text-navy-800 mb-4 inline-block"
      >
        ← Back to training
      </Link>

      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-navy-900">
          {trainingModule.title}
        </h1>
        {completed && <Badge tone="success">Completed</Badge>}
      </div>
      <p className="text-steel-500 mb-8">{trainingModule.summary}</p>

      <Card className="p-7 mb-8">
        <div className="prose-training">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {trainingModule.content}
          </ReactMarkdown>
        </div>
      </Card>

      <Card className="p-6 flex items-center justify-between flex-wrap gap-4">
        {trainingModule.quiz ? (
          <>
            <div>
              <div className="font-semibold text-navy-900">
                {trainingModule.quiz.title}
              </div>
              <div className="text-sm text-steel-500">
                Score {trainingModule.quiz.passPercent}% or higher to complete this
                module.
              </div>
            </div>
            <LinkButton href={`/quiz/${trainingModule.quiz.id}`} variant="primary">
              {completed ? "Retake quiz" : "Take quiz"}
            </LinkButton>
          </>
        ) : (
          <>
            <div className="font-semibold text-navy-900">
              {completed
                ? "You've marked this module complete."
                : "No quiz for this module — mark it complete when you're done reading."}
            </div>
            {!completed && <MarkCompleteButton moduleId={trainingModule.id} />}
          </>
        )}
      </Card>
    </div>
  );
}
