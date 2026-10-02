import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile, readFile, stat, open } from "node:fs/promises";
import path from "node:path";
import { ALLOWED_RESOURCE_TYPES } from "@/lib/resource-constraints";

export {
  ALLOWED_RESOURCE_TYPES,
  MAX_RESOURCE_BYTES,
  MAX_RESOURCE_MB,
  ALLOWED_AUDIO_TYPES,
  MAX_AUDIO_BYTES,
  MAX_AUDIO_MB,
} from "@/lib/resource-constraints";

// Uploads live on Vercel Blob in production and on local disk in development.
// A BLOB_READ_WRITE_TOKEN is what makes Blob usable, so that is the switch —
// local machines without one keep writing to ./uploads as before.
const USE_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// Imported lazily so local dev never loads the Blob SDK, and vice versa.
async function blob() {
  return import("@vercel/blob");
}

export async function saveUploadedFile(file: File, allowedTypes: Record<string, string>) {
  const ext = allowedTypes[file.type] ?? "bin";
  const storedName = `${randomUUID()}.${ext}`;

  if (USE_BLOB) {
    const { put } = await blob();
    await put(storedName, file, {
      access: "private",
      contentType: file.type,
      addRandomSuffix: false,
    });
    return storedName;
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, storedName), Buffer.from(await file.arrayBuffer()));
  return storedName;
}

export async function saveResourceFile(file: File) {
  return saveUploadedFile(file, ALLOWED_RESOURCE_TYPES);
}

export async function deleteUploadedFile(storedName: string) {
  try {
    if (USE_BLOB) {
      const { del } = await blob();
      await del(storedName);
      return;
    }
    await unlink(path.join(UPLOAD_DIR, storedName));
  } catch {
    // Already gone — nothing to clean up.
  }
}

export async function readUploadedFile(storedName: string) {
  if (USE_BLOB) {
    const { get } = await blob();
    const result = await get(storedName, { access: "private" });
    if (!result || result.statusCode !== 200) {
      throw new Error("File not found in storage.");
    }
    return Buffer.from(await new Response(result.stream).arrayBuffer());
  }

  return readFile(path.join(UPLOAD_DIR, storedName));
}

export async function statUploadedFile(storedName: string) {
  if (USE_BLOB) {
    const { head } = await blob();
    const meta = await head(storedName);
    return { size: meta.size };
  }

  const info = await stat(path.join(UPLOAD_DIR, storedName));
  return { size: info.size };
}

export async function readUploadedFileRange(storedName: string, start: number, end: number) {
  if (USE_BLOB) {
    // Blob has no range API here; slice the object after fetching it.
    const buffer = await readUploadedFile(storedName);
    return buffer.subarray(start, end + 1);
  }

  // Local files stream a real byte range, which keeps audio seeking cheap.
  const handle = await open(path.join(UPLOAD_DIR, storedName), "r");
  try {
    const length = end - start + 1;
    const buffer = Buffer.alloc(length);
    await handle.read(buffer, 0, length, start);
    return buffer;
  } finally {
    await handle.close();
  }
}

// Kept for existing callers.
export const deleteResourceFile = deleteUploadedFile;
export const readResourceFile = readUploadedFile;
