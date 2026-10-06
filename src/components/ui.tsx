import type React from "react";
import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-surface border border-border-subtle rounded-xl shadow-sm ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm px-4 py-2.5 transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-accent-500 text-white hover:bg-accent-600",
  navy: "bg-navy-900 text-white hover:bg-navy-800",
  outline:
    "border border-border-subtle bg-surface text-content hover:bg-surface-muted",
  ghost: "text-content-soft hover:bg-surface-muted",
  danger: "bg-danger-600 text-white hover:bg-danger-600/90",
  gold: "bg-gold-500 text-white hover:bg-gold-600",
};

/** Button styling for elements that aren't buttons — e.g. a download <a>. */
export function buttonClass(variant: keyof typeof variants = "primary", className = "") {
  return `${buttonBase} ${variants[variant]} ${className}`;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={`${buttonBase} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonBase} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function Badge({
  children,
  tone = "steel",
}: {
  children: ReactNode;
  tone?: "steel" | "success" | "danger" | "accent" | "gold";
}) {
  const tones = {
    steel: "bg-tint-neutral text-content-soft",
    success: "bg-success-100 text-success-600",
    danger: "bg-danger-100 text-danger-600",
    accent: "bg-accent-100 text-accent-600",
    gold: "bg-gold-100 text-gold-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  percent,
  animate = false,
}: {
  percent: number;
  /** Sweeps the fill out from zero on first paint, with a shine passing over it. */
  animate?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="w-full h-2 rounded-full bg-surface-muted overflow-hidden">
      <div
        className={`h-full rounded-full bg-accent-500 ${
          animate ? "progress-fill" : "transition-all"
        }`}
        style={
          animate
            ? ({ "--bar-width": `${clamped}%` } as React.CSSProperties)
            : { width: `${clamped}%` }
        }
      />
    </div>
  );
}

export function FieldLabel({
  children,
  htmlFor,
}: {
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-content-soft mb-1.5"
    >
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-border-subtle bg-surface px-3.5 py-2.5 text-sm text-content placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400";
