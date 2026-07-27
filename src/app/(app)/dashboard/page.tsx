import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { getDispatcherProgress } from "@/lib/progress";
import { Badge, Card, LinkButton, ProgressBar } from "@/components/ui";

export default async function DashboardPage() {
  const user = await requireUser();
  const { modules, total, completed, percent, allComplete } =
    await getDispatcherProgress(user.id);

  const nextStop = modules.find((m) => !m.completed);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        Overview
      </span>
      <h1 className="text-3xl font-bold text-navy-900 mt-1">
        Welcome, {user.name.split(" ")[0]}
      </h1>
      <p className="text-steel-500 mt-2 max-w-lg">
        Your onboarding route is on the left — work through each stop in order,
        then pass its quiz to move on to the next one.
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
        <Card className="p-6 mt-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="font-semibold text-navy-900">
              You&apos;ve completed the whole route.
            </div>
            <div className="text-sm text-steel-500">
              Every stop is done — your certificate is ready.
            </div>
          </div>
          <LinkButton href="/certificate" variant="primary">
            View certificate
          </LinkButton>
        </Card>
      ) : nextStop ? (
        <Card className="p-6 mt-5 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-semibold text-accent-600 uppercase tracking-wide mb-1">
              Next stop
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
            {modules.map((m, idx) => (
              <Link key={m.id} href={`/training/${m.slug}`}>
                <Card className="px-5 py-3.5 flex items-center justify-between gap-4 hover:border-accent-400 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-bold text-steel-500 shrink-0">
                      MM {idx + 1}
                    </span>
                    <span className="font-medium text-navy-900 truncate">
                      {m.title}
                    </span>
                  </div>
                  {m.completed ? (
                    <Badge tone="success">Completed</Badge>
                  ) : (
                    <Badge tone="steel">{m.estMinutes} min</Badge>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
