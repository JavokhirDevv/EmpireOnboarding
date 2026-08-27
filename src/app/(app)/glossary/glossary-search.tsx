"use client";

import { useMemo, useState } from "react";
import { Card, inputClass } from "@/components/ui";

type Term = { id: string; term: string; fullName: string | null; definition: string };

export function GlossarySearch({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.fullName?.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [terms, query]);

  return (
    <div className="mt-6">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms..."
        className={`${inputClass} py-3`}
      />

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="p-5">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-mono font-bold text-navy-900 text-lg tracking-tight">
                {t.term}
              </span>
              {t.fullName && (
                <>
                  <span className="text-steel-300">—</span>
                  <span className="font-semibold text-accent-600">{t.fullName}</span>
                </>
              )}
            </div>
            <p className="text-steel-500 text-sm leading-relaxed mt-2">{t.definition}</p>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-steel-500">
            No terms match &quot;{query}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
