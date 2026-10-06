"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

/** The theme lives on <html data-theme>, so the DOM is the source of truth. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    window.localStorage.setItem("empire-theme", theme);
  } catch {
    // Private browsing or blocked storage — the choice just won't persist.
  }
}

/**
 * Switches the platform between light and dark. The chosen theme is stored
 * per browser and re-applied by the inline script in the root layout, so the
 * page never flashes the wrong palette on load.
 */
export function ThemeToggle({
  className = "",
  tone = "light",
}: {
  className?: string;
  /** "dark" when the button sits on a navy panel, e.g. the sidebars. */
  tone?: "light" | "dark";
}) {
  // Server renders the light icon; the observer corrects it after hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "light" as Theme);
  const isDark = theme === "dark";

  const styles =
    tone === "dark"
      ? "text-steel-300 hover:text-white hover:bg-white/10"
      : "text-content-muted hover:text-content hover:bg-surface-muted";

  return (
    <button
      type="button"
      onClick={() => applyTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors ${styles} ${className}`}
      suppressHydrationWarning
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.5 9.6A5.6 5.6 0 0 1 6.4 2.5a5.8 5.8 0 1 0 7.1 7.1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.3v1.6M8 13.1v1.6M1.3 8h1.6M13.1 8h1.6M3.3 3.3l1.1 1.1M11.6 11.6l1.1 1.1M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
