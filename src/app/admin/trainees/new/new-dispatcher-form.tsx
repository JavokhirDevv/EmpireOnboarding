"use client";

import { useActionState } from "react";
import { createDispatcher } from "@/lib/actions/users";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function NewDispatcherForm() {
  const [state, action, pending] = useActionState(createDispatcher, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <input id="name" name="name" required className={inputClass} />
      </div>
      <div>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="firstname.lastname@empirenational.com"
        />
      </div>
      <div>
        <FieldLabel htmlFor="title">Title (optional)</FieldLabel>
        <input
          id="title"
          name="title"
          className={inputClass}
          placeholder="New Dispatcher"
        />
      </div>
      <div>
        <FieldLabel htmlFor="password">Temporary password</FieldLabel>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={8}
          className={inputClass}
          placeholder="At least 8 characters"
        />
      </div>
      {state?.error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Creating..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}
