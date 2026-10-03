"use client";

import { useEffect, useState } from "react";
import { useReveal } from "@/components/use-reveal";

export type Branch = {
  country: string;
  flagCode: string;
  offices: number;
  city?: string;
};

/**
 * The offices grid, animated: cards rise in one after another when the section
 * scrolls into view, and each office count ticks up from zero. Everything here
 * is decorative, so it is skipped entirely for prefers-reduced-motion.
 */
export function GlobalOffices({ branches }: { branches: Branch[] }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="relative">
      {/* Connector line with a pulse travelling along it, echoing the route motif. */}
      <div
        aria-hidden
        className={`hidden lg:block absolute left-0 right-0 top-[4.5rem] h-px bg-gradient-to-r from-transparent via-accent-400/25 to-transparent transition-opacity duration-700 ${
          revealed ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="office-pulse absolute top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-accent-400 shadow-[0_0_12px_3px_rgba(74,147,209,0.55)]" />
      </div>

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {branches.map((branch, index) => (
          <div
            key={branch.country}
            className={`office-card group bg-navy-800 border border-navy-700 rounded-2xl p-6 text-center ${
              revealed ? "is-visible" : ""
            }`}
            style={{ transitionDelay: `${index * 160}ms` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://flagcdn.com/w80/${branch.flagCode}.png`}
              alt={`${branch.country} flag`}
              width={48}
              height={32}
              className="w-12 h-8 object-cover rounded shadow-sm mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
            />
            <div className="text-3xl font-bold text-accent-400 mb-1 tabular-nums">
              <CountUp value={branch.offices} start={revealed} delay={index * 160} />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wide text-steel-300 mb-1">
              {branch.offices === 1 ? "Office" : "Offices"}
            </div>
            <div className="text-sm text-steel-100">
              {branch.city ? `${branch.city}, ${branch.country}` : branch.country}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Ticks from 0 to `value` once the card is revealed. */
function CountUp({
  value,
  start,
  delay,
}: {
  value: number;
  start: boolean;
  delay: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!start) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const DURATION = 1000;

    const timer = window.setTimeout(() => {
      if (reduced) {
        setShown(value);
        return;
      }

      const began = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - began) / DURATION, 1);
        // Ease-out so the number slows as it lands.
        setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, reduced ? 0 : delay);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [start, value, delay]);

  return <>{shown}</>;
}
