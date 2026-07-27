// Shared between server code and client components — no "server-only" import here.

export const ALLOWED_RESOURCE_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const MAX_RESOURCE_MB = 25;
export const MAX_RESOURCE_BYTES = MAX_RESOURCE_MB * 1024 * 1024;
