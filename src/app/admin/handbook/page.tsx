import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { moveHandbookPage } from "@/lib/actions/handbook";
import { Badge, Card } from "@/components/ui";
import { AddPageForm } from "./add-page-form";

export default async function AdminHandbookPage() {
  const pages = await prisma.handbookPage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Safety Handbook</h1>
        <p className="text-steel-500">
          One page per section, shown to trainees at{" "}
          <code className="text-xs">/handbook</code>. Open a page to write its
          content.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 items-start">
        <Card className="p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Add a page</h2>
          <AddPageForm />
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
                <th className="py-3 px-4 font-medium">Page</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Order</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page, idx) => {
                const moveUp = moveHandbookPage.bind(null, page.id, "up");
                const moveDown = moveHandbookPage.bind(null, page.id, "down");
                return (
                  <tr
                    key={page.id}
                    className="border-b border-border-subtle last:border-0 align-middle"
                  >
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/handbook/${page.id}`}
                        className="font-semibold text-navy-900 hover:text-accent-600"
                      >
                        {idx + 1}. {page.title}
                      </Link>
                      <div className="text-xs text-steel-500 mt-0.5">
                        /handbook/{page.slug}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {!page.published ? (
                        <Badge tone="steel">Hidden</Badge>
                      ) : page.content.trim() ? (
                        <Badge tone="success">Written</Badge>
                      ) : (
                        <Badge tone="accent">Empty</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <form action={moveUp}>
                          <button
                            type="submit"
                            disabled={idx === 0}
                            className="w-7 h-7 rounded-md border border-border-subtle text-steel-500 hover:bg-surface-muted disabled:opacity-30"
                            aria-label={`Move ${page.title} up`}
                          >
                            ↑
                          </button>
                        </form>
                        <form action={moveDown}>
                          <button
                            type="submit"
                            disabled={idx === pages.length - 1}
                            className="w-7 h-7 rounded-md border border-border-subtle text-steel-500 hover:bg-surface-muted disabled:opacity-30"
                            aria-label={`Move ${page.title} down`}
                          >
                            ↓
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-steel-500">
                    No handbook pages yet.
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
