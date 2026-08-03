"use client";

import { useActionState, useRef, useState } from "react";
import { createAudioLesson } from "@/lib/actions/audio";
import { Button, FieldLabel, inputClass } from "@/components/ui";
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_BYTES, MAX_AUDIO_MB } from "@/lib/resource-constraints";
import { formatFileSize } from "@/lib/format";

export function NewAudioLessonForm() {
  const [state, action, pending] = useActionState(createAudioLesson, undefined);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File | undefined) {
    if (!file) return "Choose an audio file to upload.";
    if (!(file.type in ALLOWED_AUDIO_TYPES)) {
      return "Only MP3, WAV, M4A, AAC, OGG, or WEBM audio files are allowed.";
    }
    if (file.size > MAX_AUDIO_BYTES) {
      return `"${file.name}" is ${formatFileSize(file.size)} — the limit is ${MAX_AUDIO_MB}MB.`;
    }
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setClientError(validateFile(e.target.files?.[0]));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const error = validateFile(fileInputRef.current?.files?.[0]);
    setClientError(error);
    if (error) {
      e.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input
          id="title"
          name="title"
          required
          className={inputClass}
          placeholder="e.g. Live Check Call Walkthrough"
        />
      </div>
      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          className={inputClass}
          placeholder="What the dispatcher will hear and why it matters"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="durationLabel">Duration (optional)</FieldLabel>
          <input
            id="durationLabel"
            name="durationLabel"
            className={inputClass}
            placeholder="e.g. 8 min"
          />
        </div>
        <div>
          <FieldLabel htmlFor="order">Display order</FieldLabel>
          <input
            id="order"
            name="order"
            type="number"
            defaultValue={0}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="file">
          Audio file (MP3, WAV, M4A, AAC, OGG, or WEBM — up to {MAX_AUDIO_MB}MB)
        </FieldLabel>
        <input
          ref={fileInputRef}
          id="file"
          name="file"
          type="file"
          required
          accept=".mp3,.wav,.m4a,.aac,.ogg,.webm,audio/*"
          onChange={handleFileChange}
          className={`${inputClass} py-2`}
        />
      </div>
      <label className="flex items-center gap-2 text-sm font-medium text-navy-800">
        <input type="checkbox" name="published" defaultChecked />
        Published (visible to dispatchers)
      </label>
      {(clientError || state?.error) && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {clientError || state?.error}
        </p>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending || !!clientError} variant="primary">
          {pending ? "Uploading..." : "Upload lesson"}
        </Button>
      </div>
    </form>
  );
}
