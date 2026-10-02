"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { resetProgress } from "@/lib/actions/training";
import { EmpireLogo } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import type { ModuleStatus } from "@/lib/progress";
import { DEPARTMENT_LABELS } from "@/lib/departments";
import type { Department } from "@/generated/prisma/enums";

type SidebarModule = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: ModuleStatus;
};

type CurriculumGroup = {
  category: string;
  modules: (SidebarModule & { stopNumber: number })[];
  completed: number;
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

  // The route is grouped by the module's own category, in route order.
  const groups = useMemo<CurriculumGroup[]>(() => {
    const byCategory: CurriculumGroup[] = [];
    modules.forEach((m, idx) => {
      const stop = { ...m, stopNumber: idx + 1 };
      const existing = byCategory.find((g) => g.category === m.category);
      if (existing) {
        existing.modules.push(stop);
        if (m.status === "completed") existing.completed++;
      } else {
        byCategory.push({
          category: m.category,
          modules: [stop],
          completed: m.status === "completed" ? 1 : 0,
        });
      }
    });
    return byCategory;
  }, [modules]);

  // Finished sections start collapsed — unless you're looking at one of their
  // stops — so the section you're actually working through stays in view.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const collapseInit = useRef(false);

  useEffect(() => {
    if (collapseInit.current) return;
    collapseInit.current = true;
    const initial: Record<string, boolean> = {};
    for (const group of groups) {
      const holdsActive = group.modules.some((m) => pathname === `/training/${m.slug}`);
      initial[group.category] =
        !holdsActive && group.modules.length > 0 && group.completed === group.modules.length;
    }
    setCollapsed(initial);
  }, [groups, pathname]);

  const toggle = (category: string) =>
    setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }));

  // One scroll region, with edge fades so a partly visible row reads as
  // "more below" instead of a clipped layout.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ top: false, bottom: false });

  const syncEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      top: el.scrollTop > 4,
      bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    syncEdges();
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, [syncEdges, collapsed, modules.length]);

  useEffect(() => {
    scrollRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <aside className="w-[17.5rem] shrink-0 bg-navy-950 text-white flex flex-col h-full min-h-0 overflow-hidden border-r border-white/[0.07]">
      <div className="px-4 pt-4 pb-3 shrink-0">
        <Link
          href="/dashboard"
          className="block rounded-lg px-1 py-1 -mx-1 hover:bg-white/[0.04] transition-colors"
        >
          <EmpireLogo dark />
        </Link>
      </div>

      {/* Progress panel — the one place the whole route is summarised */}
      <div className="px-4 pb-3 shrink-0">
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] px-3.5 py-3 flex items-center gap-3">
          <ProgressRing percent={percent} />
          <div className="min-w-0">
            <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-accent-400">
              {departmentLabel} Academy
            </div>
            <div className="text-[13px] font-semibold text-white leading-tight mt-0.5">
              {completed} of {total} stops done
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 min-h-0">
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-5 z-20 bg-gradient-to-b from-navy-950 to-transparent transition-opacity ${
            edges.top ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-6 z-20 bg-gradient-to-t from-navy-950 to-transparent transition-opacity ${
            edges.bottom ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={scrollRef}
          onScroll={syncEdges}
          className="sidebar-scroll h-full overflow-y-auto px-3 pb-4"
        >
          <NavRow
            href="/dashboard"
            active={pathname === "/dashboard"}
            icon={<HomeIcon />}
            label="Overview"
          />

          <GroupHeading>Onboarding Route</GroupHeading>

          {groups.map((group) => {
            const isCollapsed = collapsed[group.category] ?? false;
            const groupDone = group.completed === group.modules.length;

            return (
              <div key={group.category} className="mb-0.5">
                <button
                  type="button"
                  onClick={() => toggle(group.category)}
                  aria-expanded={!isCollapsed}
                  className="group w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-white/[0.04] transition-colors"
                >
                  <Chevron open={!isCollapsed} />
                  <span
                    className={`flex-1 min-w-0 truncate text-[11.5px] font-semibold ${
                      groupDone ? "text-white/45" : "text-steel-100"
                    }`}
                  >
                    {group.category}
                  </span>
                  <span
                    className={`shrink-0 text-[10px] font-bold tabular-nums ${
                      groupDone ? "text-accent-400/70" : "text-white/35"
                    }`}
                  >
                    {group.completed}/{group.modules.length}
                  </span>
                </button>

                {!isCollapsed && (
                  <div className="ml-[15px] pl-2.5 border-l border-white/[0.07]">
                    {group.modules.map((m) => {
                      const href = `/training/${m.slug}`;
                      const active = pathname === href;
                      const locked = m.status === "locked";

                      const inner = (
                        <>
                          {active && (
                            <span className="absolute -left-[11px] top-1.5 bottom-1.5 w-[2px] rounded-full bg-accent-400" />
                          )}
                          <StatusDot status={m.status} />
                          <span className="min-w-0 flex-1 leading-snug line-clamp-2">
                            {m.title}
                          </span>
                          <span
                            className={`shrink-0 self-start mt-[1px] text-[10px] font-bold tabular-nums ${
                              active ? "text-white/50" : "text-white/25"
                            }`}
                          >
                            {m.stopNumber}
                          </span>
                        </>
                      );

                      const base =
                        "relative flex items-start gap-2 rounded-md pl-2 pr-2 py-[6px] text-[13px] transition-colors";

                      return locked ? (
                        <div
                          key={m.id}
                          title="Complete the previous stop to unlock this one"
                          className={`${base} text-white/30 cursor-not-allowed`}
                        >
                          {inner}
                        </div>
                      ) : (
                        <Link
                          key={m.id}
                          href={href}
                          data-active={active ? "true" : undefined}
                          aria-current={active ? "page" : undefined}
                          className={`${base} ${
                            active
                              ? "bg-white/[0.08] text-white font-semibold"
                              : m.status === "current"
                                ? "text-white font-medium hover:bg-white/[0.04]"
                                : "text-steel-100/80 hover:bg-white/[0.04] hover:text-white"
                          }`}
                        >
                          {inner}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <GroupHeading>Reference</GroupHeading>

          <NavRow
            href="/handbook"
            active={isActive(pathname, "/handbook")}
            icon={<ShieldIcon />}
            label="Safety Handbook"
          />
          <NavRow href="/glossary" active={isActive(pathname, "/glossary")} icon={<BookIcon />} label="Glossary" />
          {department === "DISPATCH" && (
            <NavRow href="/rates" active={isActive(pathname, "/rates")} icon={<DollarIcon />} label="Rate Rules" />
          )}
          <NavRow
            href="/resources"
            active={isActive(pathname, "/resources")}
            icon={<FolderIcon />}
            label="Resources"
          />
          {department === "DISPATCH" && (
            <NavRow
              href="/audio"
              active={isActive(pathname, "/audio")}
              icon={<HeadphonesIcon />}
              label="Audio Training"
            />
          )}
          <NavRow
            href="/certificate"
            active={isActive(pathname, "/certificate")}
            icon={certificateUnlocked ? <AwardIcon /> : <LockIcon />}
            label="Certificate"
            gold={certificateUnlocked}
            trailing={
              certificateUnlocked ? (
                <span className="rounded-full bg-gold-400/15 px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-[0.1em] text-gold-400">
                  Ready
                </span>
              ) : null
            }
          />

          <div className="mt-4 px-2">
            {confirmingReset ? (
              <div className="rounded-lg bg-white/[0.06] p-3 text-xs">
                <p className="text-steel-100 mb-2.5 leading-relaxed">
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
                className="text-[11px] font-medium text-white/30 hover:text-white/70 transition-colors"
              >
                Reset my progress
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 py-3 border-t border-white/[0.07] flex items-center gap-2.5">
        <span className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-navy-600 flex items-center justify-center text-[11px] font-bold text-white">
          {initials(userName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-white truncate leading-tight">
            {userName}
          </div>
          <div className="text-[11px] text-steel-300 truncate">
            {userTitle ?? `${departmentLabel} Trainee`}
          </div>
        </div>
          <SignOutButton />
      </div>
    </aside>
  );
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function NavRow({
  href,
  active,
  icon,
  label,
  gold = false,
  trailing = null,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
  gold?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex items-center gap-2.5 rounded-md px-2 py-[7px] text-[13px] font-medium transition-colors ${
        gold
          ? "text-gold-400 hover:bg-gold-400/10"
          : active
            ? "bg-white/[0.08] text-white font-semibold"
            : "text-steel-100/85 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {active && !gold && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-accent-400" />
      )}
      <span className={`shrink-0 ${active && !gold ? "text-accent-400" : "text-white/45"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {trailing}
    </Link>
  );
}

function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pt-5 pb-1.5 text-[10px] font-bold tracking-[0.18em] uppercase text-white/30">
      {children}
    </div>
  );
}

function StatusDot({ status }: { status: ModuleStatus }) {
  if (status === "completed") {
    return (
      <span className="shrink-0 w-3.5 h-[19px] flex items-center justify-center text-accent-400">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8.5l3 3 7-7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (status === "current") {
    return (
      <span className="shrink-0 w-3.5 h-[19px] flex items-center justify-center">
        <span className="w-[7px] h-[7px] rounded-full bg-accent-400 shadow-[0_0_0_3px_rgba(74,147,209,0.2)]" />
      </span>
    );
  }
  return (
    <span className="shrink-0 w-3.5 h-[19px] flex items-center justify-center">
      <span className="w-[6px] h-[6px] rounded-full border border-white/25" />
    </span>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(percent, 0), 100) / 100);

  return (
    <span className="relative shrink-0 w-[42px] h-[42px]">
      <svg width="42" height="42" viewBox="0 0 42 42" className="-rotate-90">
        <circle cx="21" cy="21" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle
          cx="21"
          cy="21"
          r={radius}
          fill="none"
          stroke="var(--brand-accent-400)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold tabular-nums text-white">
        {percent}
        <span className="text-[8px] ml-[1px] text-white/60">%</span>
      </span>
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 text-white/35 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
    >
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2.5 6.8 8 2.5l5.5 4.3v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-6Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6.3 13.8V9.5h3.4v4.3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
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
      <path d="M2 9v-.5a6 6 0 0 1 12 0V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="1.5" y="9" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.5" y="9" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.8 13 3.6v4.1c0 3.1-2 5.4-5 6.5-3-1.1-5-3.4-5-6.5V3.6L8 1.8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5.9 7.9 7.4 9.4l2.8-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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

