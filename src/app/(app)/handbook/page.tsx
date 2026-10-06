import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";

export default async function HandbookIndexPage() {
  await requireUser();

  const pages = await prisma.handbookPage.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="stagger-children max-w-3xl mx-auto px-6 py-10">
      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-600">
        Reference
      </span>
      <h1 className="text-4xl font-bold text-content mt-1">
        Safety Handbook
      </h1>
      <p className="text-content-muted mt-2 max-w-xl">
        Empire National INC — the safety, compliance, and fraud-prevention
        rules every dispatcher works by. Pick a section to read it.
      </p>

      <div className="mt-8 space-y-2.5">
        {pages.map((page, idx) => (
          <Link key={page.id} href={`/handbook/${page.slug}`} className="block">
            <Card className="px-5 py-4 flex items-center gap-4 hover:border-accent-400 transition-colors">
              <span className="shrink-0 w-8 text-[11px] font-bold tabular-nums text-content-muted">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-content">
                  {page.title}
                </span>
                {page.summary && (
                  <span className="block text-sm text-content-muted mt-0.5">
                    {page.summary}
                  </span>
                )}
              </span>
              {!page.content.trim() && <Badge tone="steel">Empty</Badge>}
            </Card>
          </Link>
        ))}

        {pages.length === 0 && (
          <Card className="p-8 text-center text-content-muted">
            No handbook pages have been published yet.
          </Card>
        )}
      </div>
    </div>
  );
}
