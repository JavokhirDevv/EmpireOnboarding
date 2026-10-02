"use client";

import { useState, useTransition } from "react";
import { logout } from "@/lib/actions/auth";

/**
 * Sign out, with a confirmation step so a stray click doesn't end the session.
 * Asking inline keeps it inside the sidebar instead of a browser dialog.
 */
export function SignOutButton() {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        title="Sign out"
        aria-label="Sign out"
        aria-expanded={confirming}
        onClick={() => setConfirming((open) => !open)}
        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
          confirming
            ? "bg-white/10 text-white"
            : "text-steel-300 hover:text-white hover:bg-white/10"
        }`}
      >
        <SignOutIcon />
      </button>

      {confirming && (
        <div className="absolute bottom-full right-0 mb-2 w-44 rounded-lg border border-white/10 bg-navy-800 p-3 shadow-xl z-20">
          <p className="text-xs font-semibold text-white mb-2.5">Sign out of your account?</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(() => logout())}
              className="flex-1 rounded-md bg-danger-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-danger-600/90 disabled:opacity-50"
            >
              {pending ? "Signing out…" : "Yes"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="flex-1 rounded-md bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-steel-100 hover:bg-white/15"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SignOutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6.5 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h2.5M10.5 11l3-3-3-3M13.2 8H6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
