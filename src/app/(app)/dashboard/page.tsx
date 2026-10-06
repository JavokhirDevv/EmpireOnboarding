import Link from "next/link";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getTraineeProgress, departmentForRole } from "@/lib/progress";
import { Badge, Card, LinkButton, ProgressBar } from "@/components/ui";
import { CountUp } from "@/components/count-up";

export default async function DashboardPage() {
  const user = await requireUser();
  const department = departmentForRole(user.role);
  if (!department) redirect("/admin");
  const { modules, total, completed, percent, allComplete } =
    await getTraineeProgress(user.id, department);

  const nextStop = modules.find((m) => m.status === "current");

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <span
        className="fade-up inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600"
        style={{ "--reveal-delay": "60ms" } as React.CSSProperties}
      >
        Overview
      </span>
      <h1
        className="fade-up text-3xl font-bold text-content mt-1"
        style={{ "--reveal-delay": "180ms" } as React.CSSProperties}
      >
        Welcome, {user.name.split(" ")[0]}
      </h1>
      <p
        className="fade-up text-content-muted mt-2 max-w-lg"
        style={{ "--reveal-delay": "300ms" } as React.CSSProperties}
      >
        Your onboarding route is on the left — stops unlock in order, so
        finish one to move on to the next.
      </p>

      <Card
        className="fade-up p-6 mt-8"
        style={{ "--reveal-delay": "420ms" } as React.CSSProperties}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-content">
              Overall progress
            </div>
            <div className="text-xs text-content-muted">
              {completed} of {total} stops complete
            </div>
          </div>
          <div className="text-2xl font-bold text-content tabular-nums">
            <CountUp value={percent} delay={700} duration={1500} suffix="%" />
          </div>
        </div>
        <ProgressBar percent={percent} animate />
      </Card>

      {allComplete ? (
        <Card
          className="fade-up p-6 mt-5 flex items-center justify-between flex-wrap gap-4 border-gold-400/40 bg-gold-100/40"
          style={{ "--reveal-delay": "620ms" } as React.CSSProperties}
        >
          <div>
            <div className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">
              Route complete
            </div>
            <div className="font-semibold text-content">
              You&apos;ve finished every stop.
            </div>
            <div className="text-sm text-content-muted">
              Your certificate is ready to download.
            </div>
          </div>
          <LinkButton href="/certificate" variant="gold">
            View certificate
          </LinkButton>
        </Card>
      ) : nextStop ? (
        <Card
          className="fade-up p-6 mt-5 flex items-center justify-between flex-wrap gap-4"
          style={{ "--reveal-delay": "620ms" } as React.CSSProperties}
        >
          <div>
            <div className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-1">
              In progress
            </div>
            <div className="font-semibold text-content">{nextStop.title}</div>
            <div className="text-sm text-content-muted">{nextStop.summary}</div>
          </div>
          <LinkButton href={`/training/${nextStop.slug}`} variant="primary">
            Continue
          </LinkButton>
        </Card>
      ) : (
        <Card
          className="fade-up p-8 text-center text-content-muted mt-5"
          style={{ "--reveal-delay": "620ms" } as React.CSSProperties}
        >
          No training stops have been published yet. Check back soon.
        </Card>
      )}

      {total > 0 && (
        <div className="mt-10">
          <h2
            className="fade-up text-sm font-bold uppercase tracking-wide text-content-muted mb-3"
            style={{ "--reveal-delay": "780ms" } as React.CSSProperties}
          >
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
                    <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-content-muted shrink-0 w-[3.6rem]">
                      Stop {idx + 1}
                    </span>
                    <span className="font-medium text-content truncate">
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

              const rowStyle = {
                "--reveal-delay": `${880 + idx * 120}ms`,
              } as React.CSSProperties;

              return locked ? (
                <div
                  key={m.id}
                  className="slide-in"
                  style={rowStyle}
                  title="Complete the previous stop to unlock this one"
                >
                  {content}
                </div>
              ) : (
                <Link
                  key={m.id}
                  href={`/training/${m.slug}`}
                  className="slide-in block"
                  style={rowStyle}
                >
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
