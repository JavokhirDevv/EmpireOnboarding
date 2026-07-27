"use client";

import { useActionState, useRef, useState } from "react";
import { uploadResource } from "@/lib/actions/resources";
import { Button, FieldLabel, inputClass } from "@/components/ui";
import { ALLOWED_RESOURCE_TYPES, MAX_RESOURCE_BYTES, MAX_RESOURCE_MB } from "@/lib/resource-constraints";
import { formatFileSize } from "@/lib/format";

export function UploadResourceForm() {
  const [state, action, pending] = useActionState(uploadResource, undefined);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File | undefined) {
    if (!file) return "Choose a file to upload.";
    if (!(file.type in ALLOWED_RESOURCE_TYPES)) {
      return "Only PDF, PNG, JPG, WEBP, or GIF files are allowed.";
    }
    if (file.size > MAX_RESOURCE_BYTES) {
      return `"${file.name}" is ${formatFileSize(file.size)} — the limit is ${MAX_RESOURCE_MB}MB.`;
    }
    return null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const error = validateFile(e.target.files?.[0]);
    setClientError(error);
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
          placeholder="e.g. Driver Qualification File Checklist"
        />
      </div>
      <div>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <input
          id="category"
          name="category"
          required
          defaultValue="General"
          className={inputClass}
          placeholder="e.g. Policies, Equipment Photos, Forms"
        />
      </div>
      <div>
        <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
        <textarea
          id="description"
          name="description"
          rows={2}
          className={inputClass}
        />
      </div>
      <div>
        <FieldLabel htmlFor="file">
          File (PDF, PNG, JPG, WEBP, or GIF — up to {MAX_RESOURCE_MB}MB)
        </FieldLabel>
        <input
          ref={fileInputRef}
          id="file"
          name="file"
          type="file"
          required
          accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,application/pdf,image/*"
          onChange={handleFileChange}
          className={`${inputClass} py-2`}
        />
      </div>
      {(clientError || state?.error) && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {clientError || state?.error}
        </p>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending || !!clientError} variant="primary">
          {pending ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </form>
  );
}
