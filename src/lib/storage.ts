import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { ALLOWED_RESOURCE_TYPES } from "@/lib/resource-constraints";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export { ALLOWED_RESOURCE_TYPES, MAX_RESOURCE_BYTES, MAX_RESOURCE_MB } from "@/lib/resource-constraints";

function sanitizeExt(mimeType: string) {
  return ALLOWED_RESOURCE_TYPES[mimeType] ?? "bin";
}

export async function saveResourceFile(file: File) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const storedName = `${randomUUID()}.${sanitizeExt(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, storedName), buffer);
  return storedName;
}

export async function deleteResourceFile(storedName: string) {
  try {
    await unlink(path.join(UPLOAD_DIR, storedName));
  } catch {
    // Already gone — nothing to clean up.
  }
}

export async function readResourceFile(storedName: string) {
  return readFile(path.join(UPLOAD_DIR, storedName));
}
