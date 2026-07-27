"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const TermSchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(1),
  order: z.coerce.number().int().default(0),
});

export type AddTermState = { error?: string } | undefined;

export async function addGlossaryTerm(
  _prevState: AddTermState,
  formData: FormData
): Promise<AddTermState> {
  await requireAdmin();

  const parsed = TermSchema.safeParse({
    term: formData.get("term"),
    definition: formData.get("definition"),
    order: formData.get("order") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.glossaryTerm.create({ data: parsed.data });

  revalidatePath("/admin/glossary");
  revalidatePath("/glossary");
  redirect("/admin/glossary");
}

export async function deleteGlossaryTerm(termId: string) {
  await requireAdmin();
  await prisma.glossaryTerm.delete({ where: { id: termId } });
  revalidatePath("/admin/glossary");
  revalidatePath("/glossary");
  redirect("/admin/glossary");
}
