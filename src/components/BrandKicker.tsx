import { companyInfo } from "@/data/company";

/**
 * The Kanyaka Corporation name that opens every page hero: two-tone company name (white + brand gradient,
 * like the home page) and a line with the page's own label. Text only — the header already shows the logo.
 */
export default function BrandKicker({ label }: { label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold leading-none tracking-[-0.03em] sm:text-[1.75rem]">
        <span className="text-white">Kanyaka </span>
        <span className="bg-gradient-to-r from-brand-300 via-reagent to-brand-400 bg-clip-text text-transparent">Corporation</span>
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-300">
        <span className="hidden sm:inline">{companyInfo.experienceYears} years · Authorised Grasim dealer · </span>
        {label}
      </div>
    </div>
  );
}
