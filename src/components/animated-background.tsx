"use client";

import { useSyncExternalStore } from "react";

const ROUTES = [
  {
    id: "eb-route-1",
    d: "M -100,700 C 300,760 520,300 900,350 S 1320,140 1600,90",
    dur: "16s",
    begin: "0s",
    color: "var(--brand-accent-500)",
  },
  {
    id: "eb-route-2",
    d: "M -100,140 C 300,70 650,480 1000,420 S 1400,690 1600,730",
    dur: "20s",
    begin: "-6s",
    color: "var(--brand-navy-600)",
  },
  {
    id: "eb-route-3",
    d: "M -100,430 C 400,510 700,110 1100,280 S 1520,520 1600,380",
    dur: "13s",
    begin: "-2s",
    color: "var(--brand-accent-600)",
  },
  {
    id: "eb-route-4",
    d: "M -100,900 C 260,640 600,780 950,600 S 1360,300 1600,250",
    dur: "24s",
    begin: "-11s",
    color: "var(--brand-accent-400)",
  },
];

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getMotionSnapshot() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AnimatedBackground() {
  const animate = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionSnapshot,
    () => false
  );

  return (
    <div className="eb-bg" aria-hidden="true">
      <div className="eb-grid" />
      <svg
        className="eb-routes"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {ROUTES.map((route) => (
          <path key={route.id} id={route.id} className="eb-route" d={route.d} />
        ))}
        {animate &&
          ROUTES.map((route) => (
            <circle
              key={route.id}
              r="4.5"
              className="eb-pulse"
              style={{ fill: route.color, color: route.color }}
            >
              <animateMotion
                dur={route.dur}
                begin={route.begin}
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href={`#${route.id}`} />
              </animateMotion>
            </circle>
          ))}
      </svg>
    </div>
  );
}
