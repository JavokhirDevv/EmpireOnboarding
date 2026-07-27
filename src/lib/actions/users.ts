"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const NewDispatcherSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  title: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type NewDispatcherState = { error?: string } | undefined;

export async function createDispatcher(
  _prevState: NewDispatcherState,
  formData: FormData
): Promise<NewDispatcherState> {
  await requireAdmin();

  const parsed = NewDispatcherSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    title: formData.get("title") || undefined,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "A user with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      title: parsed.data.title,
      passwordHash,
      role: "DISPATCHER",
    },
  });

  revalidatePath("/admin/trainees");
  redirect("/admin/trainees");
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/trainees");
  redirect("/admin/trainees");
}
