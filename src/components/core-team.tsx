"use client";

import { useReveal } from "@/components/use-reveal";

export type TeamMember = {
  name: string;
  title: string;
  photo: string;
};

/**
 * Core team grid: portraits rise in one after another as the section comes
 * into view, and lift under the cursor.
 */
export function CoreTeam({ members }: { members: TeamMember[] }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-4xl mx-auto"
    >
      {members.map((person, index) => (
        <div
          key={person.name}
          className={`team-card group text-center ${revealed ? "is-visible" : ""}`}
          style={{ "--reveal-delay": `${index * 160}ms` } as React.CSSProperties}
        >
          <span className="team-card__frame relative block w-36 h-36 mx-auto mb-4 rounded-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={person.photo}
              alt={person.name}
              width={144}
              height={144}
              loading="lazy"
              className="w-36 h-36 rounded-full object-cover object-center bg-surface-muted ring-1 ring-border-subtle"
            />
          </span>
          <h3 className="font-semibold text-content transition-colors duration-300 group-hover:text-accent-600">
            {person.name}
          </h3>
          <p className="text-sm text-content-muted">{person.title}</p>
        </div>
      ))}
    </div>
  );
}
