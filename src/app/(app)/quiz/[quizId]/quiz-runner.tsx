"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitQuizAttempt, type QuizResult } from "@/lib/actions/quiz";
import { Badge, Button, Card, LinkButton, inputClass } from "@/components/ui";

type Option = { id: string; text: string };
type Question = {
  id: string;
  text: string;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK";
  options: Option[];
};

export function QuizRunner({
  quizId,
  quizTitle,
  contentTitle,
  backHref,
  resultsHomeHref,
  resultsHomeLabel,
  passPercent,
  questions,
}: {
  quizId: string;
  quizTitle: string;
  contentTitle: string;
  backHref: string;
  resultsHomeHref: string;
  resultsHomeLabel: string;
  passPercent: number;
  questions: Question[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitQuizAttempt(quizId, answers);
        setResult(res);
      } catch {
        setError("Something went wrong submitting your quiz. Please try again.");
      }
    });
  }

  function retake() {
    setAnswers({});
    setResult(null);
  }

  if (result) {
    return (
      <Card className="p-8 text-center">
        <div
          className={`text-4xl font-bold mb-2 ${
            result.passed ? "text-success-600" : "text-danger-600"
          }`}
        >
          {result.score}%
        </div>
        <div className="mb-1">
          {result.passed ? (
            <Badge tone="success">Passed</Badge>
          ) : (
            <Badge tone="danger">Not yet passing</Badge>
          )}
        </div>
        <p className="text-steel-500 mt-4 mb-1">
          {result.correctCount} of {result.totalQuestions} correct — you need{" "}
          {result.passPercent}% to pass.
        </p>
        <p className="text-sm text-steel-500 mb-6">
          {result.passed
            ? `"${contentTitle}" is now marked complete.`
            : "Review the material and try again when you're ready."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <LinkButton href={resultsHomeHref} variant="outline">
            {resultsHomeLabel}
          </LinkButton>
          {!result.passed && (
            <Button variant="primary" onClick={retake}>
              Retake quiz
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Link
        href={backHref}
        className="text-sm text-steel-500 hover:text-navy-800 mb-4 inline-block"
      >
        ← Back to {contentTitle}
      </Link>
      <h1 className="text-2xl font-bold text-navy-900 mb-1">{quizTitle}</h1>
      <p className="text-steel-500 mb-8">
        {questions.length} questions · {passPercent}% required to pass
      </p>

      <div className="space-y-6">
        {questions.map((q, idx) =>
          q.type === "FILL_BLANK" ? (
            <Card key={q.id} className="p-6">
              <div className="font-semibold text-navy-900 leading-relaxed">
                {idx + 1}.{" "}
                {q.text.split("____").map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <input
                        type="text"
                        value={answers[q.id] ?? ""}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                        }
                        className={`${inputClass} inline-block w-40 mx-1.5 py-1 px-2 font-normal`}
                        aria-label={`Answer for question ${idx + 1}`}
                      />
                    )}
                  </span>
                ))}
              </div>
            </Card>
          ) : (
            <Card key={q.id} className="p-6">
              <div className="font-semibold text-navy-900 mb-4">
                {idx + 1}. {q.text}
              </div>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 cursor-pointer text-sm transition-colors ${
                        selected
                          ? "border-accent-500 bg-accent-100/60"
                          : "border-border-subtle hover:bg-surface-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.id}
                        checked={selected}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                        }
                        className="accent-orange-600"
                      />
                      {opt.text}
                    </label>
                  );
                })}
              </div>
            </Card>
          )
        )}
      </div>

      {error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2 mt-4">
          {error}
        </p>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          variant="primary"
          disabled={!allAnswered || pending}
          onClick={handleSubmit}
        >
          {pending ? "Submitting..." : "Submit quiz"}
        </Button>
      </div>
    </div>
  );
}
