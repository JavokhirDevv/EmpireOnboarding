import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateAudioLesson,
  deleteAudioLesson,
  upsertAudioQuizMeta,
  addAudioQuestion,
  deleteAudioQuestion,
} from "@/lib/actions/audio";
import { Badge, Button, Card, FieldLabel, inputClass } from "@/components/ui";
import { formatFileSize } from "@/lib/format";
import { AddQuestionForm } from "@/components/admin/add-question-form";
import { requireDispatchAdmin } from "@/lib/dal";

export default async function EditAudioLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDispatchAdmin();
  const { id } = await params;

  const lesson = await prisma.audioLesson.findUnique({
    where: { id },
    include: {
      quiz: {
        include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
      },
    },
  });

  if (!lesson) notFound();

  const updateAudioLessonWithId = updateAudioLesson.bind(null, id);
  const deleteAudioLessonWithId = deleteAudioLesson.bind(null, id);
  const upsertAudioQuizMetaWithId = upsertAudioQuizMeta.bind(null, id);
  const addAudioQuestionWithId = lesson.quiz
    ? addAudioQuestion.bind(null, lesson.quiz.id)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Edit audio lesson</h1>
          <p className="text-steel-500 text-sm">
            {lesson.fileName} · {formatFileSize(lesson.sizeBytes)}
          </p>
        </div>
        <form action={deleteAudioLessonWithId}>
          <Button type="submit" variant="danger" className="text-xs px-3 py-1.5">
            Delete lesson
          </Button>
        </form>
      </div>

      <Card className="p-6">
        <audio controls preload="none" className="w-full" src={`/api/audio/${lesson.id}`} />
      </Card>

      <Card className="p-7">
        <form action={updateAudioLessonWithId} className="space-y-5">
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input
              id="title"
              name="title"
              required
              defaultValue={lesson.title}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              defaultValue={lesson.description}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <FieldLabel htmlFor="durationLabel">Duration</FieldLabel>
              <input
                id="durationLabel"
                name="durationLabel"
                defaultValue={lesson.durationLabel ?? ""}
                className={inputClass}
                placeholder="e.g. 8 min"
              />
            </div>
            <div>
              <FieldLabel htmlFor="order">Display order</FieldLabel>
              <input
                id="order"
                name="order"
                type="number"
                defaultValue={lesson.order}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-800 pb-2.5">
              <input type="checkbox" name="published" defaultChecked={lesson.published} />
              Published
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              Save changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-7">
        <h2 className="font-semibold text-navy-900 mb-1">Quiz</h2>
        <p className="text-sm text-steel-500 mb-5">
          A dispatcher marks this lesson complete once they pass the quiz.
        </p>
        <form
          action={upsertAudioQuizMetaWithId}
          className="grid grid-cols-3 gap-4 items-end mb-2"
        >
          <div className="col-span-2">
            <FieldLabel htmlFor="quizTitle">Quiz title</FieldLabel>
            <input
              id="quizTitle"
              name="title"
              required
              defaultValue={lesson.quiz?.title ?? `${lesson.title} Quiz`}
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="passPercent">Pass %</FieldLabel>
            <input
              id="passPercent"
              name="passPercent"
              type="number"
              min={1}
              max={100}
              defaultValue={lesson.quiz?.passPercent ?? 80}
              className={inputClass}
            />
          </div>
          <div className="col-span-3 flex justify-end">
            <Button type="submit" variant="outline" className="text-sm">
              {lesson.quiz ? "Update quiz settings" : "Create quiz"}
            </Button>
          </div>
        </form>
      </Card>

      {lesson.quiz && (
        <Card className="p-7">
          <h2 className="font-semibold text-navy-900 mb-5">
            Questions ({lesson.quiz.questions.length})
          </h2>

          <div className="space-y-4 mb-8">
            {lesson.quiz.questions.map((q, idx) => {
              const deleteAudioQuestionWithId = deleteAudioQuestion.bind(null, q.id);
              return (
                <div key={q.id} className="border border-border-subtle rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-medium text-navy-900 text-sm flex items-center gap-2">
                      <span>
                        {idx + 1}.{" "}
                        {q.type === "FILL_BLANK"
                          ? q.text.split("____").map((part, i, arr) => (
                              <span key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <span className="inline-block border-b-2 border-accent-400 px-3">
                                    &nbsp;
                                  </span>
                                )}
                              </span>
                            ))
                          : q.text}
                      </span>
                      {q.type === "FILL_BLANK" && <Badge tone="accent">Fill blank</Badge>}
                    </div>
                    <form action={deleteAudioQuestionWithId}>
                      <button
                        type="submit"
                        className="text-xs text-danger-600 hover:underline shrink-0"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                  {q.type === "FILL_BLANK" ? (
                    <div className="flex items-center gap-1.5 flex-wrap text-sm text-steel-500">
                      Accepted:
                      {q.options.map((o) => (
                        <Badge key={o.id} tone="success">
                          {o.text}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {q.options.map((o) => (
                        <li key={o.id} className="flex items-center gap-2">
                          {o.isCorrect ? (
                            <Badge tone="success">Correct</Badge>
                          ) : (
                            <span className="w-[52px]" />
                          )}
                          <span className="text-navy-700">{o.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            {lesson.quiz.questions.length === 0 && (
              <p className="text-sm text-steel-500">
                No questions yet — add one below.
              </p>
            )}
          </div>

          {addAudioQuestionWithId && (
            <div className="border-t border-border-subtle pt-6">
              <h3 className="font-semibold text-navy-900 text-sm mb-4">
                Add a question
              </h3>
              <AddQuestionForm action={addAudioQuestionWithId} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
