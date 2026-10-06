"use client";

import { useActionState } from "react";
import { updateHandbookPage } from "@/lib/actions/handbook";
import { Button, FieldLabel, inputClass } from "@/components/ui";

export function EditPageForm({
  pageId,
  title,
  summary,
  content,
  order,
  published,
}: {
  pageId: string;
  title: string;
  summary: string;
  content: string;
  order: number;
  published: boolean;
}) {
  const update = updateHandbookPage.bind(null, pageId);
  const [state, action, pending] = useActionState(update, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input id="title" name="title" required defaultValue={title} className={inputClass} />
      </div>

      <div>
        <FieldLabel htmlFor="summary">One-line blurb</FieldLabel>
        <input id="summary" name="summary" defaultValue={summary} className={inputClass} />
      </div>

      <div>
        <FieldLabel htmlFor="content">Page content (Markdown)</FieldLabel>
        <textarea
          id="content"
          name="content"
          rows={22}
          defaultValue={content}
          className={`${inputClass} font-mono text-[13px] leading-relaxed`}
          placeholder={"## Section heading\n\nWrite the page here. **Bold**, bullet lists, and tables all work.\n\n- First point\n- Second point"}
        />
        <p className="text-xs text-content-muted mt-1.5">
          Same formatting as training modules: <code>## Heading</code>,{" "}
          <code>**bold**</code>, <code>- bullets</code>, tables, and{" "}
          <code>![alt](/path.jpg)</code> for images.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 items-end">
        <div>
          <FieldLabel htmlFor="order">Sort order</FieldLabel>
          <input
            id="order"
            name="order"
            type="number"
            min={0}
            defaultValue={order}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-content-soft pb-2.5">
          <input type="checkbox" name="published" defaultChecked={published} />
          Visible to trainees
        </label>
      </div>

      {state?.error && (
        <p className="text-sm text-danger-600 bg-danger-100 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-1">
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Saving..." : "Save page"}
        </Button>
      </div>
    </form>
  );
}
