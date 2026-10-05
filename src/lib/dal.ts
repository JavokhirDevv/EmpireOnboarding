import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, title: true, adminDepartment: true },
  });
  return user;
});

export async function requireUser() {
  const session = await verifySession();
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, title: true, adminDepartment: true },
  });
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }
  return user;
}

/**
 * Admins either run one department or the whole company. A department-scoped
 * admin only ever sees that department's modules, trainees and results;
 * `null` means company-wide.
 */
export async function requireAdminScope() {
  const user = await requireAdmin();
  return { user, scope: user.adminDepartment ?? null };
}

/** Audio Training and Rate Rules are dispatch-only tools. */
export async function requireDispatchAdmin() {
  const { user, scope } = await requireAdminScope();
  if (scope && scope !== "DISPATCH") {
    redirect("/admin");
  }
  return user;
}
