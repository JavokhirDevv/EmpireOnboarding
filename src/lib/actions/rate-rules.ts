"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const RateRuleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  critical: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

export type AddRateRuleState = { error?: string } | undefined;

export async function addRateRule(
  _prevState: AddRateRuleState,
  formData: FormData
): Promise<AddRateRuleState> {
  await requireAdmin();

  const parsed = RateRuleSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    critical: formData.get("critical") === "on",
    order: formData.get("order") || 0,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  await prisma.rateRule.create({ data: parsed.data });

  revalidatePath("/admin/rates");
  revalidatePath("/rates");
  redirect("/admin/rates");
}

export async function deleteRateRule(ruleId: string) {
  await requireAdmin();
  await prisma.rateRule.delete({ where: { id: ruleId } });
  revalidatePath("/admin/rates");
  revalidatePath("/rates");
  redirect("/admin/rates");
}
