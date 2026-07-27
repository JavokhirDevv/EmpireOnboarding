"use client";

import { Button } from "@/components/ui";

export function PrintButton() {
  return (
    <Button variant="outline" onClick={() => window.print()}>
      Print / Save as PDF
    </Button>
  );
}
