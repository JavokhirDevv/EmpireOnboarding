// Pure department helpers with no server-only / Prisma dependency, so client
// components (e.g. the trainee sidebar) can safely import them.
import type { Department, Role } from "@/generated/prisma/enums";

export const DEPARTMENT_LABELS: Record<Department, string> = {
  DISPATCH: "Dispatch",
  TRACKING: "Tracking",
  HR: "HR",
};

/** Maps a trainee's login role to the content department they belong to. Returns null for ADMIN. */
export function departmentForRole(role: Role): Department | null {
  switch (role) {
    case "DISPATCHER":
      return "DISPATCH";
    case "TRACKING":
      return "TRACKING";
    case "HR":
      return "HR";
    default:
      return null;
  }
}
