import { prisma } from "@/lib/prisma";
import { deleteGlossaryTerm } from "@/lib/actions/glossary";
import { Card } from "@/components/ui";
import { AddTermForm } from "./add-term-form";

export default async function AdminGlossaryPage() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: [{ order: "asc" }, { term: "asc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Glossary</h1>
        <p className="text-steel-500">
          Manage the dispatch terminology dispatchers see at{" "}
          <code className="text-xs">/glossary</code>.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 items-start">
        <Card className="p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Add a term</h2>
          <AddTermForm />
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
                <th className="py-3 px-4 font-medium">Term</th>
                <th className="py-3 px-4 font-medium">Definition</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t) => {
                const deleteTermWithId = deleteGlossaryTerm.bind(null, t.id);
                return (
                  <tr
                    key={t.id}
                    className="border-b border-border-subtle last:border-0 align-top"
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-navy-900 whitespace-nowrap">
                      {t.term}
                    </td>
                    <td className="py-3 px-4 text-steel-500">{t.definition}</td>
                    <td className="py-3 px-4 text-right">
                      <form action={deleteTermWithId}>
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
              {terms.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-steel-500">
                    No terms yet.
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
