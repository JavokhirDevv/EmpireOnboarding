import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteGlossaryTerm } from "@/lib/actions/glossary";
import { Button, Card } from "@/components/ui";
import { EditTermForm } from "./edit-term-form";

export default async function EditGlossaryTermPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const term = await prisma.glossaryTerm.findUnique({ where: { id } });
  if (!term) notFound();

  const deleteTermWithId = deleteGlossaryTerm.bind(null, term.id);

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-content">Edit glossary term</h1>
        <form action={deleteTermWithId}>
          <Button type="submit" variant="danger" className="text-xs px-3 py-1.5">
            Delete term
          </Button>
        </form>
      </div>

      <Card className="p-7">
        <EditTermForm
          termId={term.id}
          term={term.term}
          fullName={term.fullName}
          definition={term.definition}
        />
      </Card>
    </div>
  );
}
