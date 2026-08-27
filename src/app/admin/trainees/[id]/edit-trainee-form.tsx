"use client";

import { useActionState } from "react";
import { updateTrainee } from "@/lib/actions/users";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function EditTraineeForm({
  userId,
  name,
  title,
}: {
  userId: string;
  name: string;
  title: string | null;
}) {
  const [state, action, pending] = useActionState(
    updateTrainee.bind(null, userId),
    undefined
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <FieldLabel htmlFor="name">Full name</FieldLabel>
        <input id="name" name="name" required defaultValue={name} className={inputClass} />
      </div>
      <div>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input
          id="title"
          name="title"
          defaultValue={title ?? ""}
          placeholder="New Dispatcher"
          className={inputClass}
        />
      </div>
      <div>
        <FieldLabel htmlFor="password">Reset password (optional)</FieldLabel>
        <input
          id="password"
          name="password"
          type="text"
          minLength={8}
          placeholder="Leave blank to keep current password"
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
          {pending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
