"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

const TRAINEE_ROLES = ["DISPATCHER", "TRACKING", "HR"] as const;

const NewTraineeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  title: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(TRAINEE_ROLES),
});

export type NewTraineeState = { error?: string } | undefined;

export async function createTrainee(
  _prevState: NewTraineeState,
  formData: FormData
): Promise<NewTraineeState> {
  await requireAdmin();

  const parsed = NewTraineeSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    title: formData.get("title") || undefined,
    password: formData.get("password"),
    role: formData.get("role"),
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
      role: parsed.data.role,
    },
  });

  revalidatePath("/admin/trainees");
  redirect("/admin/trainees");
}

const UpdateTraineeSchema = z.object({
  name: z.string().min(2),
  title: z.string().optional(),
  password: z
    .union([z.string().min(8, "Password must be at least 8 characters."), z.literal("")])
    .optional(),
});

export type UpdateTraineeState = { error?: string } | undefined;

export async function updateTrainee(
  userId: string,
  _prevState: UpdateTraineeState,
  formData: FormData
): Promise<UpdateTraineeState> {
  await requireAdmin();

  const parsed = UpdateTraineeSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title") || undefined,
    password: formData.get("password") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || !TRAINEE_ROLES.includes(target.role as (typeof TRAINEE_ROLES)[number])) {
    return { error: "Trainee not found." };
  }

  const passwordHash = parsed.data.password
    ? await bcrypt.hash(parsed.data.password, 10)
    : undefined;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: parsed.data.name,
      title: parsed.data.title,
      ...(passwordHash ? { passwordHash } : {}),
    },
  });

  revalidatePath("/admin/trainees");
  revalidatePath(`/admin/trainees/${userId}`);
  redirect(`/admin/trainees/${userId}`);
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();
  if (userId === admin.id) {
    throw new Error("You can't remove your own account.");
  }

  // Scope the delete to trainee accounts only — this action is only ever
  // exposed in the UI for trainees, and must not be usable to remove an
  // admin account even if invoked directly.
  await prisma.user.deleteMany({ where: { id: userId, role: { in: [...TRAINEE_ROLES] } } });
  revalidatePath("/admin/trainees");
  redirect("/admin/trainees");
}
