import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile, readFile, stat, open } from "node:fs/promises";
import path from "node:path";
import { ALLOWED_RESOURCE_TYPES } from "@/lib/resource-constraints";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export {
  ALLOWED_RESOURCE_TYPES,
  MAX_RESOURCE_BYTES,
  MAX_RESOURCE_MB,
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_BYTES,
  MAX_AUDIO_MB,
} from "@/lib/resource-constraints";

export async function saveUploadedFile(file: File, allowedTypes: Record<string, string>) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const ext = allowedTypes[file.type] ?? "bin";
  const storedName = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, storedName), buffer);
  return storedName;
}

export async function saveResourceFile(file: File) {
  return saveUploadedFile(file, ALLOWED_RESOURCE_TYPES);
}

export async function deleteUploadedFile(storedName: string) {
  try {
    await unlink(path.join(UPLOAD_DIR, storedName));
  } catch {
    // Already gone — nothing to clean up.
  }
}

export async function readUploadedFile(storedName: string) {
  return readFile(path.join(UPLOAD_DIR, storedName));
}

export async function statUploadedFile(storedName: string) {
  return stat(path.join(UPLOAD_DIR, storedName));
}

export async function readUploadedFileRange(storedName: string, start: number, end: number) {
  const size = end - start + 1;
  const handle = await open(path.join(UPLOAD_DIR, storedName), "r");
  try {
    const buffer = Buffer.alloc(size);
    await handle.read(buffer, 0, size, start);
    return buffer;
  } finally {
    await handle.close();
  }
}

// Kept for existing callers.
export const deleteResourceFile = deleteUploadedFile;
export const readResourceFile = readUploadedFile;
