import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getTraineeProgress, departmentForRole } from "@/lib/progress";
import { Badge, Card, LinkButton, ProgressBar } from "@/components/ui";

export default async function DashboardPage() {
  const user = await requireUser();
  const department = departmentForRole(user.role);
  if (!department) redirect("/admin");
  const { modules, total, completed, percent, allComplete } =
    await getTraineeProgress(user.id, department);

  const nextStop = modules.find((m) => m.status === "current");

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        Overview
      </span>
      <h1 className="text-3xl font-bold text-navy-900 mt-1">
        Welcome, {user.name.split(" ")[0]}
      </h1>
      <p className="text-steel-500 mt-2 max-w-lg">
        Your onboarding route is on the left — stops unlock in order, so
        finish one to move on to the next.
      </p>

      <Card className="p-6 mt-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-navy-900">
              Overall progress
            </div>
            <div className="text-xs text-steel-500">
              {completed} of {total} stops complete
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900">{percent}%</div>
        </div>
        <ProgressBar percent={percent} />
      </Card>

      {allComplete ? (
        <Card className="p-6 mt-5 flex items-center justify-between flex-wrap gap-4 border-gold-400/40 bg-gold-100/40">
          <div>
            <div className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">
              Route complete
            </div>
            <div className="font-semibold text-navy-900">
              You&apos;ve finished every stop.
            </div>
            <div className="text-sm text-steel-500">
              Your certificate is ready to download.
            </div>
          </div>
          <LinkButton href="/certificate" variant="gold">
            View certificate
          </LinkButton>
        </Card>
      ) : nextStop ? (
        <Card className="p-6 mt-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-1">
              In progress
            </div>
            <div className="font-semibold text-navy-900">{nextStop.title}</div>
            <div className="text-sm text-steel-500">{nextStop.summary}</div>
          </div>
          <LinkButton href={`/training/${nextStop.slug}`} variant="primary">
            Continue
          </LinkButton>
        </Card>
      ) : (
        <Card className="p-8 text-center text-steel-500 mt-5">
          No training stops have been published yet. Check back soon.
        </Card>
      )}

      {total > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-steel-500 mb-3">
            Your route
          </h2>
          <div className="space-y-2">
            {modules.map((m, idx) => {
              const locked = m.status === "locked";
              const content = (
                <Card
                  className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                    locked
                      ? "opacity-60"
                      : "hover:border-accent-400 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-steel-500 shrink-0 w-[3.6rem]">
                      Stop {idx + 1}
                    </span>
                    <span className="font-medium text-navy-900 truncate">
                      {m.title}
                    </span>
                  </div>
                  {m.status === "completed" ? (
                    <Badge tone="success">Completed</Badge>
                  ) : m.status === "current" ? (
                    <Badge tone="accent">In progress</Badge>
                  ) : (
                    <Badge tone="steel">Locked</Badge>
                  )}
                </Card>
              );

              return locked ? (
                <div key={m.id} title="Complete the previous stop to unlock this one">
                  {content}
                </div>
              ) : (
                <Link key={m.id} href={`/training/${m.slug}`}>
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
