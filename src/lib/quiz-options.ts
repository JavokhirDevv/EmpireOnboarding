// Answer-position shuffling for multiple-choice questions.
//
// Question authors naturally type the correct answer first, which leaves every
// quiz with the answer sitting in slot A. These helpers spread the correct
// answer across A/B/C/D instead. The shuffle is seeded by the question text so
// the same question always lands on the same arrangement — re-running the seed
// script or re-importing questions won't reshuffle a quiz under a trainee.

function hash(input: string): number {
  // FNV-1a, 32-bit.
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/**
 * Returns the options reordered deterministically from the question text.
 * Each item keeps whatever payload it carries (text, correctness), so the
 * correct answer simply moves to a different slot.
 */
export function shuffleAnswerOptions<T extends { text: string }>(
  questionText: string,
  options: T[]
): T[] {
  return options
    .map((option, index) => ({
      option,
      index,
      rank: hash(`${questionText}#${index}#${option.text}`),
    }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map((entry) => entry.option);
}
