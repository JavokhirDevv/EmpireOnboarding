"use client";

import { usePathname } from "next/navigation";

/**
 * Plays a short entrance animation on every page, and again on each
 * navigation — the pathname key remounts the wrapper so the animation
 * restarts even when two routes share a component.
 *
 * The dashboard is skipped: it runs its own slower, staggered intro.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return <>{children}</>;
  }

  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}
