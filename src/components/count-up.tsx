"use client";

import { useEffect, useState } from "react";

/**
 * Counts from zero up to `value` once `start` is true. Shared by the landing
 * page office tiles and the dashboard progress card.
 */
export function CountUp({
  value,
  start = true,
  delay = 0,
  duration = 1000,
  suffix = "",
}: {
  value: number;
  start?: boolean;
  delay?: number;
  duration?: number;
  suffix?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!start) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const timer = window.setTimeout(() => {
      if (reduced) {
        setShown(value);
        return;
      }

      const began = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - began) / duration, 1);
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
  }, [start, value, delay, duration]);

  return (
    <>
      {shown}
      {suffix}
    </>
  );
}
