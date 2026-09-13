// Single source of truth for how an answer is graded, shared by the submit
// action and the printable result sheet.

export type GradableOption = { id: string; text: string; isCorrect: boolean };
export type GradableQuestion = {
  type: "MULTIPLE_CHOICE" | "FILL_BLANK";
  options: GradableOption[];
};

const normalize = (s: string) => s.trim().toLowerCase();

/**
 * Grades one submitted answer. For MULTIPLE_CHOICE the submission is an option
 * id; for FILL_BLANK it is typed text matched against the accepted variants.
 * `matched` is the option that scored it, when there is one.
 */
export function gradeAnswer(
  question: GradableQuestion,
  submitted: string
): { correct: boolean; matched: GradableOption | null } {
  const value = (submitted ?? "").trim();

  if (question.type === "FILL_BLANK") {
    const matched = question.options.find((o) => normalize(o.text) === normalize(value)) ?? null;
    return { correct: !!matched, matched };
  }

  const correctOption = question.options.find((o) => o.isCorrect) ?? null;
  return { correct: !!correctOption && value === correctOption.id, matched: correctOption };
}

/** How the correct answer reads on a result sheet. */
export function correctAnswerLabel(question: GradableQuestion): string {
  if (question.type === "FILL_BLANK") {
    return question.options.map((o) => o.text).join(" / ");
  }
  return question.options.find((o) => o.isCorrect)?.text ?? "";
}
