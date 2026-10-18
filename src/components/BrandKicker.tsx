import Image from "next/image";
import { companyInfo } from "@/data/company";

/**
 * The Kanyaka Corporation lock-up that opens every page hero: logo tile, the company name
 * (white + brand gradient, like the home page), and a line with the page's own label.
 * Keeps the brand the first thing a visitor reads on any page they land on.
 */
export default function BrandKicker({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="relative inline-block h-12 w-12 shrink-0 overflow-hidden rounded-md shadow-[0_10px_30px_-10px_rgba(14,165,233,0.7)] ring-1 ring-white/15">
        <Image src="/icon.png" alt="" width={48} height={48} className="h-full w-full" />
      </span>
      <div className="min-w-0">
        <div className="font-display text-2xl font-semibold leading-none tracking-[-0.03em] sm:text-[1.75rem]">
          <span className="text-white">Kanyaka </span>
          <span className="bg-gradient-to-r from-brand-300 via-reagent to-brand-400 bg-clip-text text-transparent">Corporation</span>
        </div>
        <div className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-300">
          <span className="hidden sm:inline">{companyInfo.experienceYears} years · Authorised Grasim dealer · </span>
          {label}
        </div>
      </div>
    </div>
  );
}
