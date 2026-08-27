"use client";

import { useActionState } from "react";
import { updateGlossaryTerm } from "@/lib/actions/glossary";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function EditTermForm({
  termId,
  term,
  fullName,
  definition,
}: {
  termId: string;
  term: string;
  fullName: string | null;
  definition: string;
}) {
  const [state, action, pending] = useActionState(
    updateGlossaryTerm.bind(null, termId),
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="term">Term</FieldLabel>
        <input
          id="term"
          name="term"
          required
          defaultValue={term}
          className={inputClass}
          placeholder="e.g. TMS"
        />
      </div>
      <div>
        <FieldLabel htmlFor="fullName">Full name (optional)</FieldLabel>
        <input
          id="fullName"
          name="fullName"
          defaultValue={fullName ?? ""}
          className={inputClass}
          placeholder="e.g. Transportation Management System"
        />
      </div>
      <div>
        <FieldLabel htmlFor="definition">Definition</FieldLabel>
        <textarea
          id="definition"
          name="definition"
          required
          rows={3}
          defaultValue={definition}
          className={inputClass}
          placeholder="Plain-language explanation for a brand-new dispatcher"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
