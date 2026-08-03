"use client";

import { useState } from "react";
import { Button, FieldLabel, inputClass } from "@/components/ui";

type QuestionKind = "MULTIPLE_CHOICE" | "FILL_BLANK";

export function AddQuestionForm({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [type, setType] = useState<QuestionKind>("MULTIPLE_CHOICE");

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      <div className="inline-flex rounded-lg border border-border-subtle p-0.5 bg-surface-muted">
        <TypeTab active={type === "MULTIPLE_CHOICE"} onClick={() => setType("MULTIPLE_CHOICE")}>
          Multiple choice
        </TypeTab>
        <TypeTab active={type === "FILL_BLANK"} onClick={() => setType("FILL_BLANK")}>
          Fill in the blank
        </TypeTab>
      </div>

      {type === "MULTIPLE_CHOICE" ? (
        <>
          <div>
            <FieldLabel htmlFor="text">Question</FieldLabel>
            <input id="text" name="text" required className={inputClass} />
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="correctIndex"
                  value={i}
                  required
                  defaultChecked={i === 0}
                  className="accent-orange-600"
                  aria-label={`Option ${i + 1} is correct`}
                />
                <input
                  type="text"
                  name="optionText"
                  required
                  placeholder={`Option ${i + 1}`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-steel-500">
            Select the radio button next to the correct answer.
          </p>
        </>
      ) : (
        <>
          <div>
            <FieldLabel htmlFor="blankText">Sentence with a blank</FieldLabel>
            <input
              id="blankText"
              name="blankText"
              required
              className={inputClass}
              placeholder="The driver said his ETA was ____ minutes away."
            />
            <p className="text-xs text-steel-500 mt-1.5">
              Use <code>____</code> (four underscores) where the blank goes.
            </p>
          </div>
          <div>
            <FieldLabel htmlFor="acceptedAnswer0">Accepted answer(s)</FieldLabel>
            <div className="space-y-2">
              <input
                id="acceptedAnswer0"
                name="acceptedAnswer"
                required
                className={inputClass}
                placeholder="Correct answer"
              />
              <input
                name="acceptedAnswer"
                className={inputClass}
                placeholder="Accepted variant (optional)"
              />
              <input
                name="acceptedAnswer"
                className={inputClass}
                placeholder="Accepted variant (optional)"
              />
            </div>
            <p className="text-xs text-steel-500 mt-1.5">
              Graded case-insensitively; extra spaces are ignored. Add
              variants like &quot;ETA&quot; / &quot;estimated time of
              arrival&quot; on separate lines.
            </p>
          </div>
        </>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" className="text-sm">
          Add question
        </Button>
      </div>
    </form>
  );
}

function TypeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
        active ? "bg-surface text-navy-900 shadow-sm" : "text-steel-500 hover:text-navy-800"
      }`}
    >
      {children}
    </button>
  );
}
