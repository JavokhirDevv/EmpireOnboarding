"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

function formatEasternTime(date: Date) {
  const parts = formatter.formatToParts(date);
  const zone = parts.find((p) => p.type === "timeZoneName")?.value ?? "ET";
  const time = parts
    .filter((p) => p.type !== "timeZoneName")
    .map((p) => p.value)
    .join("")
    .trim();
  return { zone, time };
}

let cachedTimestamp = Date.now();

function subscribeToClock(callback: () => void) {
  const id = setInterval(() => {
    cachedTimestamp = Date.now();
    callback();
  }, 1000);
  return () => clearInterval(id);
}

function getClockSnapshot() {
  return cachedTimestamp;
}

function getServerClockSnapshot() {
  return 0;
}

function useEasternClock() {
  const timestamp = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getServerClockSnapshot
  );
  if (timestamp === 0) return null;
  return formatEasternTime(new Date(timestamp));
}

function ClockBadge({ zone, time }: { zone: string; time: string }) {
  return (
    <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-br from-navy-700 to-navy-950 px-3.5 py-2 shadow-lg shadow-navy-950/20 ring-1 ring-white/10">
      <span className="text-[10px] font-bold tracking-widest text-accent-400 uppercase">
        {zone}
      </span>
      <span className="h-3 w-px bg-white/20" />
      <span className="font-mono text-sm font-semibold tabular-nums text-white">
        {time}
      </span>
    </div>
  );
}

/** Floating badge, fixed to the corner — for shells with no header bar of their own. */
export function LiveClock() {
  const clock = useEasternClock();
  if (!clock) return null;
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <ClockBadge zone={clock.zone} time={clock.time} />
      </div>
    </div>
  );
}

/** Plain inline badge — for embedding inside an existing header/nav row. */
export function InlineClock() {
  const clock = useEasternClock();
  if (!clock) return null;
  return <ClockBadge zone={clock.zone} time={clock.time} />;
}
