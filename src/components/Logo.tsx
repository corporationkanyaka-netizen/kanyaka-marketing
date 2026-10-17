import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light-bg" | "dark-bg" | "mark-only";
  showTagline?: boolean;
}

const dimensions = {
  sm: { mark: 36, name: "text-lg", corp: "text-[9px]" },
  md: { mark: 44, name: "text-[1.45rem]", corp: "text-[10px]" },
  lg: { mark: 52, name: "text-[1.7rem]", corp: "text-[11px]" },
};

/** Kanyaka Corporation brand lock-up: the official KC tile + wordmark. */
export default function Logo({ className = "", size = "md", variant = "light-bg", showTagline = true }: LogoProps) {
  const d = dimensions[size];
  const isDarkBg = variant === "dark-bg";

  const mark = (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-md transition-transform duration-300 group-hover:-translate-y-0.5 ${
        isDarkBg ? "ring-1 ring-white/15" : "shadow-[0_8px_20px_-8px_rgba(18,36,58,0.55)] ring-1 ring-black/5"
      }`}
      style={{ width: d.mark, height: d.mark }}
    >
      <Image src="/icon.png" alt="Kanyaka Corporation logo" width={d.mark} height={d.mark} priority className="h-full w-full" />
    </span>
  );

  if (variant === "mark-only") return <span className={`inline-flex ${className}`}>{mark}</span>;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {mark}
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-display font-semibold tracking-[-0.02em] ${d.name} ${isDarkBg ? "text-white" : "text-ink-950"}`}
        >
          Kanyaka
        </span>
        <span className="mt-1 h-[2px] w-full rounded-md bg-gradient-to-r from-[#e0203f] via-[#e0203f]/60 to-[#2aaaeb]" />
        <span
          className={`mt-1 font-medium uppercase tracking-[0.34em] ${d.corp} ${isDarkBg ? "text-slate-300" : "text-brand-700"}`}
        >
          Corporation
        </span>
      </span>

      {showTagline && (
        <span
          className={`ml-1 hidden flex-col justify-center border-l pl-4 text-xs leading-snug xl:flex ${
            isDarkBg ? "border-white/15 text-slate-400" : "border-line text-slate-500"
          }`}
        >
          <span className={`font-medium ${isDarkBg ? "text-slate-200" : "text-ink-900"}`}>Chemicals &amp; Solvents</span>
          <span>Authorised Grasim dealer</span>
        </span>
      )}
    </span>
  );
}
