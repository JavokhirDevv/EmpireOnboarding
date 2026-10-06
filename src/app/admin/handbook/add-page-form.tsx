"use client";

import { useActionState } from "react";
import { createHandbookPage } from "@/lib/actions/handbook";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function AddPageForm() {
  const [state, action, pending] = useActionState(createHandbookPage, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="title">Page title</FieldLabel>
        <input
          id="title"
          name="title"
          required
          className={inputClass}
          placeholder="e.g. Blind Shipment"
        />
      </div>
      <div>
        <FieldLabel htmlFor="summary">One-line blurb (optional)</FieldLabel>
        <input
          id="summary"
          name="summary"
          className={inputClass}
          placeholder="Shown under the title on the handbook index"
        />
      </div>
      <input type="hidden" name="content" value="" />
      <input type="hidden" name="order" value="0" />
      <input type="hidden" name="published" value="on" />
      <p className="text-xs text-content-muted">
        The page is created empty and added to the end of the handbook. Open it
        to write the content.
      </p>
      {state?.error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="flex justify-end pt-1">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Adding..." : "Add page"}
        </Button>
      </div>
    </form>
  );
}
