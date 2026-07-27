"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/ui";

type Term = { id: string; term: string; definition: string };

export function GlossarySearch({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return terms;
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
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

      <dl className="mt-6 divide-y divide-border-subtle">
        {filtered.map((t) => (
          <div key={t.id} className="py-4">
            <dt className="font-mono font-semibold text-navy-900">{t.term}</dt>
            <dd className="text-steel-500 mt-1 leading-relaxed">{t.definition}</dd>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-steel-500">
            No terms match &quot;{query}&quot;.
          </p>
        )}
      </dl>
    </div>
  );
}
