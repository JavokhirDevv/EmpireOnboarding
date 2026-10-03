"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Flips to true the first time the element scrolls into view, so a section can
 * animate itself in once. Sections using this keep a non-animated appearance
 * under prefers-reduced-motion, which is handled in CSS.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, revealed };
}
