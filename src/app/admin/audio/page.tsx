import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Card, LinkButton } from "@/components/ui";

export default async function AdminAudioPage() {
  const lessons = await prisma.audioLesson.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: { quiz: { include: { questions: true } } },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Audio training</h1>
          <p className="text-steel-500">
            Upload recordings and build a knowledge-check quiz for each one.
          </p>
        </div>
        <LinkButton href="/admin/audio/new" variant="primary">
          + New audio lesson
        </LinkButton>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
              <th className="py-3 px-5 font-medium">Title</th>
              <th className="py-3 px-5 font-medium">Duration</th>
              <th className="py-3 px-5 font-medium">Order</th>
              <th className="py-3 px-5 font-medium">Quiz</th>
              <th className="py-3 px-5 font-medium">Status</th>
              <th className="py-3 px-5 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {lessons.map((lesson) => (
              <tr
                key={lesson.id}
                className="border-b border-border-subtle last:border-0 hover:bg-surface-muted"
              >
                <td className="py-3 px-5">
                  <Link
                    href={`/admin/audio/${lesson.id}`}
                    className="font-medium text-navy-900 hover:text-accent-600"
                  >
                    {lesson.title}
                  </Link>
                </td>
                <td className="py-3 px-5 text-steel-500">
                  {lesson.durationLabel ?? "—"}
                </td>
                <td className="py-3 px-5 text-steel-500">{lesson.order}</td>
                <td className="py-3 px-5 text-steel-500">
                  {lesson.quiz ? `${lesson.quiz.questions.length} questions` : "—"}
                </td>
                <td className="py-3 px-5">
                  {lesson.published ? (
                    <Badge tone="success">Published</Badge>
                  ) : (
                    <Badge tone="steel">Draft</Badge>
                  )}
                </td>
                <td className="py-3 px-5 text-right">
                  <LinkButton
                    href={`/admin/audio/${lesson.id}`}
                    variant="outline"
                    className="text-xs px-3 py-1.5"
                  >
                    Edit
                  </LinkButton>
                </td>
              </tr>
            ))}
            {lessons.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-steel-500">
                  No audio lessons yet. Upload your first recording.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
