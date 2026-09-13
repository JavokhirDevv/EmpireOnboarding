import { z } from "zod";
import { shuffleAnswerOptions } from "./quiz-options";

// Shared by both admin question-builder actions (module quizzes and audio
// quizzes) — not itself a server action, just parsing/shaping helpers.

export const BLANK_MARKER = "____";

const MultipleChoiceSchema = z.object({
  type: z.literal("MULTIPLE_CHOICE"),
  text: z.string().min(2),
  optionTexts: z.array(z.string().min(1)).min(2).max(6),
  correctIndex: z.coerce.number().int().min(0),
});

const FillBlankSchema = z.object({
  type: z.literal("FILL_BLANK"),
  text: z
    .string()
    .min(2)
    .refine((s) => s.includes(BLANK_MARKER), {
      message: `Include ${BLANK_MARKER} (four underscores) where the blank goes.`,
    }),
  acceptedAnswers: z.array(z.string().min(1)).min(1).max(3),
});

export const QuestionInputSchema = z.discriminatedUnion("type", [
  MultipleChoiceSchema,
  FillBlankSchema,
]);

export type QuestionInput = z.infer<typeof QuestionInputSchema>;

export function parseQuestionFormData(formData: FormData): QuestionInput {
  const type = formData.get("type") === "FILL_BLANK" ? "FILL_BLANK" : "MULTIPLE_CHOICE";

  if (type === "FILL_BLANK") {
    const acceptedAnswers = formData
      .getAll("acceptedAnswer")
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
    return QuestionInputSchema.parse({
      type: "FILL_BLANK",
      text: formData.get("blankText"),
      acceptedAnswers,
    });
  }

  const optionTexts = formData.getAll("optionText").map(String);
  return QuestionInputSchema.parse({
    type: "MULTIPLE_CHOICE",
    text: formData.get("text"),
    optionTexts,
    correctIndex: formData.get("correctIndex"),
  });
}

export function questionCreateData(input: QuestionInput, order: number) {
  if (input.type === "FILL_BLANK") {
    return {
      text: input.text,
      type: "FILL_BLANK" as const,
      order,
      options: {
        create: input.acceptedAnswers.map((text, i) => ({
          text,
          isCorrect: true,
          order: i,
        })),
      },
    };
  }
  // Stored in shuffled order so the correct answer doesn't always sit in slot A.
  const shuffled = shuffleAnswerOptions(
    input.text,
    input.optionTexts.map((text, i) => ({ text, isCorrect: i === input.correctIndex }))
  );

  return {
    text: input.text,
    type: "MULTIPLE_CHOICE" as const,
    order,
    options: {
      create: shuffled.map((option, i) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        order: i,
      })),
    },
  };
}
