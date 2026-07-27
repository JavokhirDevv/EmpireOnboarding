"use client";

import { useTransition } from "react";
import { markModuleComplete } from "@/lib/actions/training";
import { Button } from "@/components/ui";

export function MarkCompleteButton({ moduleId }: { moduleId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="primary"
      disabled={pending}
      onClick={() => startTransition(() => markModuleComplete(moduleId))}
    >
      {pending ? "Saving..." : "Mark as complete"}
    </Button>
  );
}
