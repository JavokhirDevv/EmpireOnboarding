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

export const ALLOWED_AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/ogg": "ogg",
  "audio/webm": "webm",
};

export const MAX_AUDIO_MB = 60;
export const MAX_AUDIO_BYTES = MAX_AUDIO_MB * 1024 * 1024;
