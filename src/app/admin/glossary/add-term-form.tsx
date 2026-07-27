"use client";

import { useActionState } from "react";
import { addGlossaryTerm } from "@/lib/actions/glossary";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function AddTermForm() {
  const [state, action, pending] = useActionState(addGlossaryTerm, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="term">Term</FieldLabel>
        <input
          id="term"
          name="term"
          required
          className={inputClass}
          placeholder="e.g. TMS"
        />
      </div>
      <div>
        <FieldLabel htmlFor="definition">Definition</FieldLabel>
        <textarea
          id="definition"
          name="definition"
          required
          rows={3}
          className={inputClass}
          placeholder="Plain-language explanation for a brand-new dispatcher"
        />
      </div>
      <div>
        <FieldLabel htmlFor="order">Sort order (optional)</FieldLabel>
        <input
          id="order"
          name="order"
          type="number"
          defaultValue={0}
          className={inputClass}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Adding..." : "Add term"}
        </Button>
      </div>
    </form>
  );
}
