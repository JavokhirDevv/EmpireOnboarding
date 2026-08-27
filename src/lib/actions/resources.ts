"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import {
  ALLOWED_RESOURCE_TYPES,
  MAX_RESOURCE_BYTES,
  MAX_RESOURCE_MB,
  deleteResourceFile,
  saveResourceFile,
} from "@/lib/storage";

const ResourceMetaSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
});

export type UploadResourceState = { error?: string } | undefined;

export async function uploadResource(
  _prevState: UploadResourceState,
  formData: FormData
): Promise<UploadResourceState> {
  const admin = await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a file to upload." };
  }
  if (!(file.type in ALLOWED_RESOURCE_TYPES)) {
    return { error: "Only PDF, PNG, JPG, WEBP, or GIF files are allowed." };
  }
  if (file.size > MAX_RESOURCE_BYTES) {
    return { error: `File is too large — the limit is ${MAX_RESOURCE_MB}MB.` };
  }

  const parsed = ResourceMetaSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const storedName = await saveResourceFile(file);

  await prisma.resource.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      category: parsed.data.category,
      fileName: file.name,
      storedName,
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedById: admin.id,
    },
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function deleteResource(resourceId: string) {
  await requireAdmin();

  const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
  if (!resource) return;

  await prisma.resource.delete({ where: { id: resourceId } });
  await deleteResourceFile(resource.storedName);

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  redirect("/admin/resources");
}
