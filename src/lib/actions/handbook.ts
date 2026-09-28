"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const PageSchema = z.object({
  title: z.string().min(1, "Give the page a title."),
  summary: z.string().optional(),
  content: z.string(),
  order: z.coerce.number().int().min(0),
  published: z.boolean(),
});

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "page"
  );
}

/** Slugs are unique, so a duplicate title gets a numeric suffix. */
async function uniqueSlug(base: string, exceptId?: string) {
  let slug = base;
  for (let n = 2; ; n++) {
    const clash = await prisma.handbookPage.findUnique({ where: { slug } });
    if (!clash || clash.id === exceptId) return slug;
    slug = `${base}-${n}`;
  }
}

function parse(formData: FormData) {
  return PageSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary") || undefined,
    content: formData.get("content") ?? "",
    order: formData.get("order") || 0,
    published: formData.get("published") === "on",
  });
}

function revalidateHandbook(slug?: string) {
  revalidatePath("/admin/handbook");
  revalidatePath("/handbook");
  if (slug) revalidatePath(`/handbook/${slug}`);
}

export type HandbookFormState = { error?: string } | undefined;

export async function createHandbookPage(
  _prevState: HandbookFormState,
  formData: FormData
): Promise<HandbookFormState> {
  await requireAdmin();

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const last = await prisma.handbookPage.findFirst({ orderBy: { order: "desc" } });
  const page = await prisma.handbookPage.create({
    data: {
      ...parsed.data,
      order: parsed.data.order || (last?.order ?? 0) + 1,
      slug: await uniqueSlug(slugify(parsed.data.title)),
    },
  });

  revalidateHandbook(page.slug);
  redirect(`/admin/handbook/${page.id}`);
}

export async function updateHandbookPage(
  pageId: string,
  _prevState: HandbookFormState,
  formData: FormData
): Promise<HandbookFormState> {
  await requireAdmin();

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const existing = await prisma.handbookPage.findUnique({ where: { id: pageId } });
  if (!existing) return { error: "That page no longer exists." };

  // Keep the URL stable unless the title actually changed.
  const slug =
    existing.title === parsed.data.title
      ? existing.slug
      : await uniqueSlug(slugify(parsed.data.title), pageId);

  await prisma.handbookPage.update({
    where: { id: pageId },
    data: { ...parsed.data, slug },
  });

  revalidateHandbook(existing.slug);
  revalidateHandbook(slug);
  return undefined;
}

export async function deleteHandbookPage(pageId: string) {
  await requireAdmin();
  const page = await prisma.handbookPage.delete({ where: { id: pageId } });
  revalidateHandbook(page.slug);
  redirect("/admin/handbook");
}

/** Moves a page one place up or down in the handbook order. */
export async function moveHandbookPage(pageId: string, direction: "up" | "down") {
  await requireAdmin();

  const pages = await prisma.handbookPage.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const index = pages.findIndex((p) => p.id === pageId);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= pages.length) return;

  await prisma.$transaction([
    prisma.handbookPage.update({ where: { id: pages[index].id }, data: { order: swapWith } }),
    prisma.handbookPage.update({ where: { id: pages[swapWith].id }, data: { order: index } }),
  ]);

  // Orders can drift from their index over time; normalise the untouched rows.
  await prisma.$transaction(
    pages
      .map((p, i) => ({ p, i }))
      .filter(({ i }) => i !== index && i !== swapWith)
      .map(({ p, i }) =>
        prisma.handbookPage.update({ where: { id: p.id }, data: { order: i } })
      )
  );

  revalidateHandbook();
}
