import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

// One graded answer as it appears on the printed sheet.
export type PdfAnswerRow = {
  number: number;
  questionText: string;
  givenAnswer: string;
  correctAnswer: string;
  correct: boolean;
};

export type QuizResultPdfInput = {
  traineeName: string;
  traineeEmail: string;
  traineeTitle?: string | null;
  quizTitle: string;
  contentTitle: string;
  completedAt: Date;
  score: number;
  passPercent: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
  answers: PdfAnswerRow[];
};

const PAGE_WIDTH = 612; // US Letter, in points
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const NAVY = rgb(0.07, 0.13, 0.25);
const STEEL = rgb(0.42, 0.46, 0.53);
const ORANGE = rgb(0.85, 0.38, 0.09);
const GREEN = rgb(0.09, 0.5, 0.27);
const RED = rgb(0.72, 0.15, 0.15);
const RULE = rgb(0.85, 0.87, 0.9);

// The standard PDF fonts are WinAnsi-encoded, so typographic characters that
// slip in from question text are folded down to their ASCII equivalents.
function sanitize(text: string): string {
  return text
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "");
}

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitize(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export async function buildQuizResultPdf(input: QuizResultPdfInput): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const body = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const pages: PDFPage[] = [];
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  pages.push(page);
  let y = PAGE_HEIGHT - MARGIN;

  function ensureSpace(needed: number) {
    if (y - needed >= MARGIN + 30) return;
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pages.push(page);
    y = PAGE_HEIGHT - MARGIN;
  }

  function text(
    value: string,
    opts: { font?: PDFFont; size?: number; color?: typeof NAVY; indent?: number; gap?: number }
  ) {
    const font = opts.font ?? body;
    const size = opts.size ?? 10;
    const indent = opts.indent ?? 0;
    const lineHeight = size * 1.35;

    for (const line of wrap(value, font, size, CONTENT_WIDTH - indent)) {
      ensureSpace(lineHeight);
      page.drawText(line, {
        x: MARGIN + indent,
        y: y - size,
        size,
        font,
        color: opts.color ?? NAVY,
      });
      y -= lineHeight;
    }
    y -= opts.gap ?? 0;
  }

  function rule(gap = 10) {
    ensureSpace(gap + 2);
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: PAGE_WIDTH - MARGIN, y },
      thickness: 0.75,
      color: RULE,
    });
    y -= gap;
  }

  // Header
  text("EMPIRE NATIONAL", { font: bold, size: 9, color: ORANGE });
  y -= 2;
  text("Training Quiz Result", { font: bold, size: 19, gap: 4 });
  text(sanitize(input.quizTitle), { size: 11, color: STEEL, gap: 8 });
  rule(14);

  // Trainee + score summary
  const meta: [string, string][] = [
    ["Trainee", input.traineeTitle ? `${input.traineeName} (${input.traineeTitle})` : input.traineeName],
    ["Email", input.traineeEmail],
    ["Material", input.contentTitle],
    ["Completed", formatDate(input.completedAt)],
    [
      "Score",
      `${input.score}% - ${input.correctCount} of ${input.totalQuestions} correct (pass mark ${input.passPercent}%)`,
    ],
    ["Result", input.passed ? "PASSED" : "NOT PASSED"],
  ];

  for (const [label, value] of meta) {
    const labelWidth = 74;
    const size = 10;
    const lines = wrap(value, body, size, CONTENT_WIDTH - labelWidth);
    ensureSpace(size * 1.35 * lines.length);
    page.drawText(`${label}`, { x: MARGIN, y: y - size, size, font: bold, color: STEEL });
    lines.forEach((line, i) => {
      page.drawText(line, {
        x: MARGIN + labelWidth,
        y: y - size - i * size * 1.35,
        size,
        font: label === "Result" ? bold : body,
        color: label === "Result" ? (input.passed ? GREEN : RED) : NAVY,
      });
    });
    y -= size * 1.35 * lines.length;
  }

  y -= 8;
  rule(16);
  text("Answer sheet", { font: bold, size: 12, gap: 8 });

  for (const row of input.answers) {
    ensureSpace(46);
    text(`${row.number}. ${row.questionText}`, { font: bold, size: 10, gap: 2 });
    text(`${row.correct ? "[correct]" : "[incorrect]"}  Answer given: ${row.givenAnswer || "(blank)"}`, {
      size: 10,
      indent: 14,
      color: row.correct ? GREEN : RED,
    });
    if (!row.correct) {
      text(`Correct answer: ${row.correctAnswer}`, { size: 10, indent: 14, color: STEEL });
    }
    y -= 8;
  }

  // Footer on every page, once the page count is known.
  const generated = `Generated ${formatDate(new Date())} - Empire National onboarding`;
  pages.forEach((p, i) => {
    p.drawText(sanitize(generated), {
      x: MARGIN,
      y: MARGIN - 18,
      size: 8,
      font: body,
      color: STEEL,
    });
    const label = `Page ${i + 1} of ${pages.length}`;
    p.drawText(label, {
      x: PAGE_WIDTH - MARGIN - body.widthOfTextAtSize(label, 8),
      y: MARGIN - 18,
      size: 8,
      font: body,
      color: STEEL,
    });
  });

  return pdf.save();
}
