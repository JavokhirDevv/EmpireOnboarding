import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteHandbookPage } from "@/lib/actions/handbook";
import { Button, Card } from "@/components/ui";
import { EditPageForm } from "./edit-page-form";

export default async function EditHandbookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.handbookPage.findUnique({ where: { id } });
  if (!page) notFound();

  const deletePageWithId = deleteHandbookPage.bind(null, page.id);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <Link
        href="/admin/handbook"
        className="text-sm text-steel-500 hover:text-navy-800 inline-block"
      >
        ← Safety Handbook
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">{page.title}</h1>
          <p className="text-steel-500 text-sm">/handbook/{page.slug}</p>
        </div>
        <form action={deletePageWithId}>
          <Button type="submit" variant="danger" className="text-xs px-3 py-1.5">
            Delete page
          </Button>
        </form>
      </div>

      <Card className="p-7">
        <EditPageForm
          pageId={page.id}
          title={page.title}
          summary={page.summary ?? ""}
          content={page.content}
          order={page.order}
          published={page.published}
        />
      </Card>
    </div>
  );
}
