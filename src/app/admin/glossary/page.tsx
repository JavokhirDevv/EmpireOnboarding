import { prisma } from "@/lib/prisma";
import { deleteGlossaryTerm } from "@/lib/actions/glossary";
import { Card, LinkButton } from "@/components/ui";
import { AddTermForm } from "./add-term-form";

type Term = {
  id: string;
  term: string;
  fullName: string | null;
  definition: string;
};

function splitIntoColumns(items: Term[], columns: number): Term[][] {
  if (columns <= 1) return [items];
  const perColumn = Math.ceil(items.length / columns);
  const result: Term[][] = [];
  for (let i = 0; i < columns; i++) {
    const chunk = items.slice(i * perColumn, (i + 1) * perColumn);
    if (chunk.length > 0) result.push(chunk);
  }
  return result;
}

function TermTable({ terms }: { terms: Term[] }) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col className="w-[15%]" />
          <col className="w-[20%]" />
          <col className="w-[47%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
            <th className="py-3 px-4 font-medium border-r border-border-subtle">Term</th>
            <th className="py-3 px-4 font-medium border-r border-border-subtle">Full Name</th>
            <th className="py-3 px-4 font-medium border-r border-border-subtle">Definition</th>
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
                <td className="py-3 px-4 font-mono font-semibold text-navy-900 border-r border-border-subtle break-words">
                  {t.term}
                </td>
                <td className="py-3 px-4 text-steel-500 border-r border-border-subtle break-words">
                  {t.fullName ?? "—"}
                </td>
                <td className="py-3 px-4 text-steel-500 border-r border-border-subtle leading-relaxed">
                  {t.definition}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col items-start gap-1.5">
                    <LinkButton
                      href={`/admin/glossary/${t.id}`}
                      variant="outline"
                      className="text-xs px-3 py-1.5 w-full justify-center"
                    >
                      Edit
                    </LinkButton>
                    <form action={deleteTermWithId} className="w-full">
                      <button
                        type="submit"
                        className="text-xs text-danger-600 hover:underline w-full text-center"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

export default async function AdminGlossaryPage() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: "asc" },
  });

  const columnCount = terms.length > 20 ? 3 : terms.length > 8 ? 2 : 1;
  const columns = splitIntoColumns(terms, columnCount);
  const gridClass =
    columns.length === 3
      ? "grid gap-5 xl:grid-cols-3"
      : columns.length === 2
        ? "grid gap-5 lg:grid-cols-2"
        : "grid gap-5";

  return (
    <div className="px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Glossary</h1>
        <p className="text-steel-500">
          Manage the dispatch terminology dispatchers see at{" "}
          <code className="text-xs">/glossary</code>.
        </p>
      </div>

      <Card className="p-6 mb-8 max-w-xl">
        <h2 className="font-semibold text-navy-900 mb-4">Add a term</h2>
        <AddTermForm />
      </Card>

      {terms.length === 0 ? (
        <Card className="py-8 text-center text-steel-500">No terms yet.</Card>
      ) : (
        <div className={gridClass}>
          {columns.map((col, idx) => (
            <TermTable key={idx} terms={col} />
          ))}
        </div>
      )}
    </div>
  );
}
