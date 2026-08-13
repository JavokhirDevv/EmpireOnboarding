"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { logout } from "@/lib/actions/auth";
import { EmpireLogo } from "@/components/logo";
import { Badge } from "@/components/ui";

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 bg-navy-950 text-white flex flex-col h-full min-h-0 overflow-hidden">
      <div className="px-6 pt-7 pb-6 shrink-0">
        <Link href="/admin" className="block">
          <EmpireLogo dark />
        </Link>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 space-y-7">
        <div className="space-y-1">
          <NavLink href="/admin" label="Overview" pathname={pathname} exact>
            <HomeIcon />
          </NavLink>
        </div>

        <div>
          <SectionLabel>Training Content</SectionLabel>
          <div className="space-y-1">
            <NavLink href="/admin/modules" label="Modules" pathname={pathname}>
              <LayersIcon />
            </NavLink>
            <NavLink href="/admin/audio" label="Audio Training" pathname={pathname}>
              <HeadphonesIcon />
            </NavLink>
            <NavLink href="/admin/glossary" label="Glossary" pathname={pathname}>
              <BookIcon />
            </NavLink>
            <NavLink href="/admin/rates" label="Rate Rules" pathname={pathname}>
              <DollarIcon />
            </NavLink>
            <NavLink href="/admin/resources" label="Resources" pathname={pathname}>
              <FolderIcon />
            </NavLink>
          </div>
        </div>

        <div>
          <SectionLabel>People</SectionLabel>
          <div className="space-y-1">
            <NavLink href="/admin/trainees" label="Dispatchers" pathname={pathname}>
              <UsersIcon />
            </NavLink>
          </div>
        </div>
      </nav>

      <div className="shrink-0 px-4 pb-5 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="min-w-0">
            <Badge tone="accent">Admin</Badge>
            <div className="text-sm font-semibold text-white truncate mt-1.5">
              {userName}
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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-3 mb-2 text-[10px] font-semibold tracking-[0.14em] uppercase text-steel-400">
      {children}
    </div>
  );
}

function NavLink({
  href,
  label,
  pathname,
  exact = false,
  children,
}: {
  href: string;
  label: string;
  pathname: string;
  exact?: boolean;
  children: ReactNode;
}) {
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
        active ? "bg-white/10 text-white" : "text-steel-100 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
      {label}
    </Link>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 7.5 8 2l6 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 6.5V13a1 1 0 0 0 1 1H6a1 1 0 0 0 1-1v-2.5a1 1 0 0 1 1-1 1 1 0 0 1 1 1V13a1 1 0 0 0 1 1h1.5a1 1 0 0 0 1-1V6.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2 14 5.2 8 8.4 2 5.2 8 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M2 8.8 8 12l6-3.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 11.6 8 14.8l6-3.2"
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

function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.3" r="2.3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M1.8 13.2c.5-2.3 2.2-3.6 4.2-3.6s3.7 1.3 4.2 3.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M10.3 3.3c1.1.2 1.9 1.1 1.9 2.3 0 1.1-.8 2.1-1.8 2.3M12 9.7c1.7.4 2.9 1.6 3.3 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
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
