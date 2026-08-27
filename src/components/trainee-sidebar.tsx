"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { logout } from "@/lib/actions/auth";
import { resetProgress } from "@/lib/actions/training";
import { EmpireLogo } from "@/components/logo";
import type { ModuleStatus } from "@/lib/progress";
import { DEPARTMENT_LABELS } from "@/lib/departments";
import type { Department } from "@/generated/prisma/enums";

type SidebarModule = {
  id: string;
  slug: string;
  title: string;
  status: ModuleStatus;
};

export function TraineeSidebar({
  department,
  modules,
  completed,
  total,
  percent,
  certificateUnlocked,
  userName,
  userTitle,
}: {
  department: Department;
  modules: SidebarModule[];
  completed: number;
  total: number;
  percent: number;
  certificateUnlocked: boolean;
  userName: string;
  userTitle: string | null;
}) {
  const pathname = usePathname();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [pending, startTransition] = useTransition();
  const departmentLabel = DEPARTMENT_LABELS[department];

  return (
    <aside className="w-80 shrink-0 bg-navy-950 text-white flex flex-col h-full min-h-0 overflow-hidden">
      <div className="px-6 pt-7 pb-5 shrink-0">
        <Link href="/dashboard" className="block mb-6">
          <EmpireLogo dark />
        </Link>
        <div className="text-[11px] font-semibold tracking-[0.18em] uppercase text-steel-300">
          {departmentLabel} Academy
        </div>
        <h1 className="text-xl font-bold text-white mt-0.5">Onboarding Route</h1>

        <div className="mt-5">
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-steel-300 mb-2">
            {completed} / {total} stops complete
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent-400 transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-6 pb-4">
        <ol className="relative">
          <div className="absolute left-[19px] top-2 bottom-2 border-l-2 border-dashed border-white/15" />
          {modules.map((m, idx) => {
            const href = `/training/${m.slug}`;
            const active = pathname === href;
            const locked = m.status === "locked";

            const circle = (
              <span
                className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  m.status === "completed"
                    ? "bg-accent-500 border-accent-500 text-white"
                    : m.status === "current"
                      ? "border-accent-400 text-accent-400 bg-navy-950"
                      : "border-white/15 text-white/30 bg-navy-950"
                }`}
              >
                {m.status === "completed" ? (
                  <CheckIcon />
                ) : m.status === "current" ? (
                  <PlayIcon />
                ) : (
                  <LockIcon />
                )}
              </span>
            );

            const label = (
              <span className="pt-1.5 min-w-0">
                <span
                  className={`block text-[10px] font-semibold tracking-[0.14em] uppercase ${
                    locked ? "text-white/25" : "text-steel-300"
                  }`}
                >
                  MM {idx + 1}
                  {m.status === "current" && (
                    <span className="ml-2 text-accent-400">In progress</span>
                  )}
                </span>
                <span
                  className={`block text-sm font-semibold leading-snug ${
                    locked
                      ? "text-white/30"
                      : active
                        ? "text-white"
                        : "text-steel-100 group-hover:text-white"
                  }`}
                >
                  {m.title}
                </span>
              </span>
            );

            return (
              <li key={m.id} className="relative pb-5 last:pb-0">
                {locked ? (
                  <div
                    className="group flex items-start gap-3.5 rounded-lg -mx-2 px-2 py-1.5 cursor-not-allowed"
                    title="Complete the previous stop to unlock this one"
                  >
                    {circle}
                    {label}
                  </div>
                ) : (
                  <Link
                    href={href}
                    className={`group flex items-start gap-3.5 rounded-lg -mx-2 px-2 py-1.5 transition-colors ${
                      active ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    {circle}
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="shrink-0 px-6 pb-6 pt-4 border-t border-white/10 space-y-1.5">
        <SidebarUtilityLink href="/glossary" pathname={pathname} label="Glossary">
          <BookIcon />
        </SidebarUtilityLink>
        {department === "DISPATCH" && (
          <SidebarUtilityLink href="/rates" pathname={pathname} label="Rate Rules">
            <DollarIcon />
          </SidebarUtilityLink>
        )}
        <SidebarUtilityLink href="/resources" pathname={pathname} label="Resources">
          <FolderIcon />
        </SidebarUtilityLink>
        {department === "DISPATCH" && (
          <SidebarUtilityLink href="/audio" pathname={pathname} label="Audio Training">
            <HeadphonesIcon />
          </SidebarUtilityLink>
        )}
        <SidebarUtilityLink
          href="/certificate"
          pathname={pathname}
          label="Certificate"
          gold={certificateUnlocked}
        >
          {certificateUnlocked ? <AwardIcon /> : <LockIcon />}
        </SidebarUtilityLink>

        <div className="pt-2">
          {confirmingReset ? (
            <div className="rounded-lg bg-white/5 p-3 text-xs">
              <p className="text-steel-100 mb-2">
                This clears all completed stops and quiz scores. This can&apos;t be undone.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => resetProgress())}
                  className="flex-1 rounded-md bg-danger-600 text-white font-semibold px-2.5 py-1.5 hover:bg-danger-600/90 disabled:opacity-50"
                >
                  {pending ? "Resetting…" : "Yes, reset"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReset(false)}
                  className="flex-1 rounded-md bg-white/10 text-steel-100 font-semibold px-2.5 py-1.5 hover:bg-white/15"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="text-xs text-steel-300 hover:text-white transition-colors"
            >
              Reset my progress
            </button>
          )}
        </div>

        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{userName}</div>
            <div className="text-xs text-steel-300 truncate">
              {userTitle ?? `${departmentLabel} Trainee`}
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              title="Sign out"
              className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-steel-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SignOutIcon />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}

function SidebarUtilityLink({
  href,
  pathname,
  label,
  gold = false,
  children,
}: {
  href: string;
  pathname: string;
  label: string;
  gold?: boolean;
  children: React.ReactNode;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
        gold
          ? "bg-gold-400/10 text-gold-400 hover:bg-gold-400/15"
          : active
            ? "bg-white/10 text-white"
            : "text-steel-100 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
      {label}
      {gold && (
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wide text-gold-400">
          Ready
        </span>
      )}
    </Link>
  );
}

function DollarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5v13M11 4.2c0-1.2-1.3-2.2-3-2.2s-3 1-3 2.3c0 3 6 1.5 6 4.4 0 1.3-1.3 2.3-3 2.3s-3-1-3-2.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeadphonesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 9v-.5a6 6 0 0 1 12 0V9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect x="1.5" y="9" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.5" y="9" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8.5l3 3 7-7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 2.7c0-.9 1-1.5 1.8-1L13 6c.8.5.8 1.5 0 2l-7.2 4.3c-.8.5-1.8-.1-1.8-1V2.7Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect
        x="3"
        y="7"
        width="10"
        height="7"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 3.5C2 2.7 2.7 2 3.5 2H8v12H3.5A1.5 1.5 0 0 1 2 12.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M14 3.5c0-.8-.7-1.5-1.5-1.5H8v12h4.5a1.5 1.5 0 0 0 1.5-1.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4.5A1.5 1.5 0 0 1 3.5 3h2.6l1.2 1.5H12.5A1.5 1.5 0 0 1 14 6v5.5A1.5 1.5 0 0 1 12.5 13h-9A1.5 1.5 0 0 1 2 11.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5.5 9.3 4.5 14l3.5-1.8L11.5 14l-1-4.7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
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
