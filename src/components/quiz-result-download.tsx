import { buttonClass } from "@/components/ui";

/**
 * Downloads the PDF answer sheet for one quiz attempt. A plain anchor, not a
 * <Link>: this is a file download, not a client-side navigation.
 */
export function QuizResultDownload({
  attemptId,
  label = "Download results (PDF)",
  variant = "navy",
  className = "",
}: {
  attemptId: string;
  label?: string;
  variant?: "navy" | "outline";
  className?: string;
}) {
  return (
    <a
      href={`/api/quiz-attempts/${attemptId}/pdf`}
      download
      className={buttonClass(variant, className)}
    >
      {label}
    </a>
  );
}
