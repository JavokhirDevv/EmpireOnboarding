import { prisma } from "@/lib/prisma";
import { GlossarySearch } from "./glossary-search";

export default async function GlossaryPage() {
  const terms = await prisma.glossaryTerm.findMany({
    orderBy: { term: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        Reference
      </span>
      <h1 className="text-4xl font-bold text-content mt-1">Glossary</h1>
      <p className="text-content-muted mt-3 max-w-lg">
        Common terms you&apos;ll hear on your first weeks in dispatch. Search or
        scroll — this list will keep growing as you pick up more of the job.
      </p>

      <GlossarySearch
        terms={terms.map((t) => ({
          id: t.id,
          term: t.term,
          fullName: t.fullName,
          definition: t.definition,
        }))}
      />
    </div>
  );
}
