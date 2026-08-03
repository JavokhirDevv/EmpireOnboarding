"use client";

import { useActionState } from "react";
import { addRateRule } from "@/lib/actions/rate-rules";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function AddRuleForm() {
  const [state, action, pending] = useActionState(addRateRule, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="title">Rule title</FieldLabel>
        <input
          id="title"
          name="title"
          required
          className={inputClass}
          placeholder="e.g. What makes a rate valid"
        />
      </div>
      <div>
        <FieldLabel htmlFor="description">Full rule text</FieldLabel>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
          placeholder="Write the complete rule as dispatchers should read it"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 items-end">
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
        <label className="flex items-center gap-2 text-sm font-medium text-navy-800 pb-2.5">
          <input type="checkbox" name="critical" />
          Flag as critical
        </label>
      </div>
      <p className="text-xs text-steel-500 -mt-2">
        Critical rules (violations/consequences) are shown with a warning
        highlight so they stand out.
      </p>
      {state?.error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Adding..." : "Add rule"}
        </Button>
      </div>
    </form>
  );
}
