import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import { MarkdownContent } from "@/components/markdown-content";

export default async function HandbookPageView({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await requireUser();

  const pages = await prisma.handbookPage.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  const index = pages.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const page = pages[index];
  const previous = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;

  return (
    <div className="stagger-children max-w-3xl mx-auto px-6 py-10">
      <Link
        href="/handbook"
        className="text-sm text-steel-500 hover:text-navy-800 mb-5 inline-flex items-center gap-1.5"
      >
        ← Safety Handbook
      </Link>

      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-600">
          Page {index + 1} of {pages.length}
        </span>
        <span className="h-3 w-px bg-border-subtle" />
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-steel-500">
          Safety Handbook
        </span>
      </div>

      <h1 className="text-3xl font-bold text-navy-900 mb-2">{page.title}</h1>
      {page.summary && (
        <p className="text-steel-500 mb-8 max-w-xl">{page.summary}</p>
      )}

      <Card className="overflow-hidden mb-6">
        <div className="h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-navy-600" />
        <div className="prose-training p-7">
          {page.content.trim() ? (
            <MarkdownContent>{page.content}</MarkdownContent>
          ) : (
            <p className="text-steel-500">
              This page has not been written yet. An administrator can add its
              content from the admin panel.
            </p>
          )}
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {previous ? (
          <Link href={`/handbook/${previous.slug}`}>
            <Card className="p-4 hover:border-accent-400 transition-colors h-full">
              <div className="text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">
                ← Previous
              </div>
              <div className="text-sm font-semibold text-navy-900">
                {previous.title}
              </div>
            </Card>
          </Link>
        ) : (
          <span />
        )}

        {next ? (
          <Link href={`/handbook/${next.slug}`}>
            <Card className="p-4 hover:border-accent-400 transition-colors h-full text-right">
              <div className="text-xs font-semibold text-steel-500 uppercase tracking-wide mb-1">
                Next →
              </div>
              <div className="text-sm font-semibold text-navy-900">
                {next.title}
              </div>
            </Card>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
