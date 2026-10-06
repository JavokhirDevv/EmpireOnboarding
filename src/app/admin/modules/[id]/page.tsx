import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdminScope } from "@/lib/dal";
import {
  updateModule,
  deleteModule,
  upsertQuizMeta,
  addQuestion,
  deleteQuestion,
} from "@/lib/actions/modules";
import { Badge, Button, Card, FieldLabel, inputClass } from "@/components/ui";
import { AddQuestionForm } from "@/components/admin/add-question-form";

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { scope } = await requireAdminScope();
  const { id } = await params;

  const trainingModule = await prisma.module.findUnique({
    where: { id },
    include: {
      quiz: {
        include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
      },
    },
  });

  if (!trainingModule) notFound();
  // Out of a department admin's remit.
  if (scope && trainingModule.department !== scope) notFound();

  const updateModuleWithId = updateModule.bind(null, id);
  const deleteModuleWithId = deleteModule.bind(null, id);
  const upsertQuizMetaWithId = upsertQuizMeta.bind(null, id);
  const addQuestionWithId = trainingModule.quiz
    ? addQuestion.bind(null, trainingModule.quiz.id)
    : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-content">Edit module</h1>
          <p className="text-content-muted text-sm">/training/{trainingModule.slug}</p>
        </div>
        <form action={deleteModuleWithId}>
          <Button type="submit" variant="danger" className="text-xs px-3 py-1.5">
            Delete module
          </Button>
        </form>
      </div>

      <Card className="p-7">
        <form action={updateModuleWithId} className="space-y-5">
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input
              id="title"
              name="title"
              required
              defaultValue={trainingModule.title}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <FieldLabel htmlFor="department">Department</FieldLabel>
              <select
                id="department"
                name="department"
                defaultValue={trainingModule.department}
                className={inputClass}
              >
                <option value="DISPATCH">Dispatch</option>
                <option value="TRACKING">Tracking</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <input
                id="category"
                name="category"
                required
                defaultValue={trainingModule.category}
                className={inputClass}
              />
            </div>
            <div>
              <FieldLabel htmlFor="estMinutes">Est. minutes</FieldLabel>
              <input
                id="estMinutes"
                name="estMinutes"
                type="number"
                min={1}
                defaultValue={trainingModule.estMinutes}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="summary">Short summary</FieldLabel>
            <input
              id="summary"
              name="summary"
              required
              defaultValue={trainingModule.summary}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="content">Content (Markdown)</FieldLabel>
            <textarea
              id="content"
              name="content"
              required
              rows={16}
              defaultValue={trainingModule.content}
              className={`${inputClass} font-mono text-[13px] leading-relaxed`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <FieldLabel htmlFor="order">Display order</FieldLabel>
              <input
                id="order"
                name="order"
                type="number"
                defaultValue={trainingModule.order}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-content-soft pb-2.5">
              <input
                type="checkbox"
                name="published"
                defaultChecked={trainingModule.published}
              />
              Published (visible to trainees)
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
        <h2 className="font-semibold text-content mb-1">Quiz</h2>
        <p className="text-sm text-content-muted mb-5">
          A module with a quiz is only marked complete once the trainee
          passes it.
        </p>
        <form
          action={upsertQuizMetaWithId}
          className="grid grid-cols-3 gap-4 items-end mb-2"
        >
          <div className="col-span-2">
            <FieldLabel htmlFor="quizTitle">Quiz title</FieldLabel>
            <input
              id="quizTitle"
              name="title"
              required
              defaultValue={trainingModule.quiz?.title ?? `${trainingModule.title} Quiz`}
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
              defaultValue={trainingModule.quiz?.passPercent ?? 80}
              className={inputClass}
            />
          </div>
          <div className="col-span-3 flex justify-end">
            <Button type="submit" variant="outline" className="text-sm">
              {trainingModule.quiz ? "Update quiz settings" : "Create quiz"}
            </Button>
          </div>
        </form>
      </Card>

      {trainingModule.quiz && (
        <Card className="p-7">
          <h2 className="font-semibold text-content mb-5">
            Questions ({trainingModule.quiz.questions.length})
          </h2>

          <div className="space-y-4 mb-8">
            {trainingModule.quiz.questions.map((q, idx) => {
              const deleteQuestionWithId = deleteQuestion.bind(null, q.id);
              return (
                <div
                  key={q.id}
                  className="border border-border-subtle rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-medium text-content text-sm flex items-center gap-2">
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
                    <form action={deleteQuestionWithId}>
                      <button
                        type="submit"
                        className="text-xs text-danger-600 hover:underline shrink-0"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                  {q.type === "FILL_BLANK" ? (
                    <div className="flex items-center gap-1.5 flex-wrap text-sm text-content-muted">
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
                          <span className="text-content-soft">{o.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
            {trainingModule.quiz.questions.length === 0 && (
              <p className="text-sm text-content-muted">
                No questions yet — add one below.
              </p>
            )}
          </div>

          {addQuestionWithId && (
            <div className="border-t border-border-subtle pt-6">
              <h3 className="font-semibold text-content text-sm mb-4">
                Add a question
              </h3>
              <AddQuestionForm action={addQuestionWithId} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
