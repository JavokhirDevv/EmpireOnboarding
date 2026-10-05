import { prisma } from "@/lib/prisma";
import { deleteRateRule } from "@/lib/actions/rate-rules";
import { Badge, Card } from "@/components/ui";
import { AddRuleForm } from "./add-rule-form";
import { requireDispatchAdmin } from "@/lib/dal";

export default async function AdminRatesPage() {
  await requireDispatchAdmin();
  const rules = await prisma.rateRule.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Rate rules</h1>
        <p className="text-steel-500">
          Manage the internal rate-bidding rules dispatchers see at{" "}
          <code className="text-xs">/rates</code>.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 items-start">
        <Card className="p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Add a rule</h2>
          <AddRuleForm />
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
                <th className="py-3 px-4 font-medium">Rule</th>
                <th className="py-3 px-4 font-medium"></th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => {
                const deleteRuleWithId = deleteRateRule.bind(null, r.id);
                return (
                  <tr
                    key={r.id}
                    className="border-b border-border-subtle last:border-0 align-top"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-navy-900">{r.title}</div>
                      <div className="text-steel-500 mt-0.5 whitespace-pre-line">
                        {r.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {r.critical && <Badge tone="danger">Critical</Badge>}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <form action={deleteRuleWithId}>
                        <button
                          type="submit"
                          className="text-xs text-danger-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-steel-500">
                    No rules yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
