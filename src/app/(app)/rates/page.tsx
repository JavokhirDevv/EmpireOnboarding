import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";

export default async function RatesPage() {
  const rules = await prisma.rateRule.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        Policy
      </span>
      <h1 className="text-4xl font-bold text-navy-900 mt-1">Rate Rules</h1>

      <Card className="p-5 mt-6 bg-accent-100/50 border-accent-400/30">
        <p className="text-sm text-navy-800 leading-relaxed">
          These rules exist purely out of respect for other dispatchers, and
          to avoid any internal issues or cheating. People are this
          company&apos;s most important and valuable asset — these rules
          exist so everyone can work well and feel comfortable doing it. They
          may be updated over time based on results.
        </p>
      </Card>

      <div className="mt-8 space-y-4">
        {rules.map((rule, idx) => (
          <Card
            key={rule.id}
            className={`p-5 ${
              rule.critical ? "border-danger-600/40 bg-danger-100/40" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h2 className="font-semibold text-navy-900">
                {idx + 1}. {rule.title}
              </h2>
              {rule.critical && <Badge tone="danger">Critical</Badge>}
            </div>
            <p className="text-sm text-steel-500 leading-relaxed whitespace-pre-line">
              {rule.description}
            </p>
          </Card>
        ))}

        {rules.length === 0 && (
          <Card className="p-8 text-center text-steel-500">
            No rate rules have been published yet.
          </Card>
        )}
      </div>
    </div>
  );
}
