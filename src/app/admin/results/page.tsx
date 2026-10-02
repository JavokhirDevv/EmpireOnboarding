import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";
import { QuizResultDownload } from "@/components/quiz-result-download";
import { DEPARTMENT_LABELS, departmentForRole } from "@/lib/progress";
import type { Department, Role } from "@/generated/prisma/enums";

const TABS: { label: string; value: Department | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Dispatch", value: "DISPATCH" },
  { label: "Tracking", value: "TRACKING" },
  { label: "HR", value: "HR" },
];

const ROLE_FOR_DEPARTMENT: Record<Department, Role> = {
  DISPATCH: "DISPATCHER",
  TRACKING: "TRACKING",
  HR: "HR",
};

const PAGE_SIZE = 100;

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string; result?: string }>;
}) {
  const { department, result } = await searchParams;
  const activeTab = TABS.some((t) => t.value === department) ? department! : "ALL";
  const onlyFailed = result === "failed";

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      ...(activeTab === "ALL"
        ? { user: { role: { in: ["DISPATCHER", "TRACKING", "HR"] } } }
        : { user: { role: ROLE_FOR_DEPARTMENT[activeTab as Department] } }),
      ...(onlyFailed ? { passed: false } : {}),
    },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
      quiz: {
        select: {
          title: true,
          module: { select: { title: true } },
          audioLesson: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  });

  const passedCount = attempts.filter((a) => a.passed).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Test results</h1>
        <p className="text-steel-500">
          Every quiz a trainee has submitted. Download the answer sheet as a PDF
          to keep or forward to HR.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        {TABS.map((tab) => {
          const params = new URLSearchParams();
          if (tab.value !== "ALL") params.set("department", tab.value);
          if (onlyFailed) params.set("result", "failed");
          const query = params.toString();
          const active = tab.value === activeTab;
          return (
            <Link
              key={tab.value}
              href={`/admin/results${query ? `?${query}` : ""}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-navy-900 text-white"
                  : "text-steel-500 hover:bg-surface-muted"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}

        <span className="mx-1 h-5 w-px bg-border-subtle" />

        {[
          { label: "All results", failed: false },
          { label: "Not passing", failed: true },
        ].map((option) => {
          const params = new URLSearchParams();
          if (activeTab !== "ALL") params.set("department", activeTab);
          if (option.failed) params.set("result", "failed");
          const query = params.toString();
          const active = option.failed === onlyFailed;
          return (
            <Link
              key={option.label}
              href={`/admin/results${query ? `?${query}` : ""}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-navy-900 text-white"
                  : "text-steel-500 hover:bg-surface-muted"
              }`}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      {attempts.length > 0 && (
        <p className="text-sm text-steel-500 mb-3">
          Showing {attempts.length} attempt{attempts.length === 1 ? "" : "s"} ·{" "}
          {passedCount} passed · {attempts.length - passedCount} not passing
          {attempts.length === PAGE_SIZE && " · most recent 100"}
        </p>
      )}

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
              <th className="py-3 px-4 font-medium">Trainee</th>
              <th className="py-3 px-4 font-medium">Quiz</th>
              <th className="py-3 px-4 font-medium">Score</th>
              <th className="py-3 px-4 font-medium">Submitted</th>
              <th className="py-3 px-4 font-medium text-right">Answers</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => {
              const traineeDepartment = departmentForRole(attempt.user.role);
              const material =
                attempt.quiz.module?.title ?? attempt.quiz.audioLesson?.title ?? "—";
              return (
                <tr
                  key={attempt.id}
                  className="border-b border-border-subtle last:border-0 align-middle"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/trainees/${attempt.user.id}`}
                      className="font-semibold text-navy-900 hover:text-accent-600"
                    >
                      {attempt.user.name}
                    </Link>
                    <div className="text-xs text-steel-500">
                      {traineeDepartment ? DEPARTMENT_LABELS[traineeDepartment] : attempt.user.role}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-navy-800">{material}</div>
                    {attempt.quiz.audioLesson && (
                      <div className="text-xs text-steel-500">Audio training</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular-nums text-navy-900">
                        {attempt.score}%
                      </span>
                      {attempt.passed ? (
                        <Badge tone="success">Passed</Badge>
                      ) : (
                        <Badge tone="danger">Not passing</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-steel-500 whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(attempt.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <QuizResultDownload
                      attemptId={attempt.id}
                      label="PDF"
                      variant="outline"
                      className="text-xs px-3 py-1.5"
                    />
                  </td>
                </tr>
              );
            })}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-steel-500">
                  No quiz results yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
