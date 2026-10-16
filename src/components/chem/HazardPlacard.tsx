import React, { useId } from "react";
import type { HazardClass } from "@/lib/chem";

interface HazardPlacardProps {
  hazard: HazardClass;
  size?: number;
  className?: string;
}

const labels: Record<HazardClass, string> = {
  "8": "Class 8 — Corrosive",
  "5.1": "Class 5.1 — Oxidizer",
  "2.3": "Class 2.3 — Toxic gas",
};

/** Simplified ADR / UN transport placard (rotated diamond). */
export default function HazardPlacard({ hazard, size = 34, className = "" }: HazardPlacardProps) {
  const clipId = `hz8-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`shrink-0 ${className}`}
      role="img"
      aria-label={labels[hazard]}
    >
      <title>{labels[hazard]}</title>
      {hazard === "8" && (
        <>
          <clipPath id={clipId}>
            <path d="M50 3 97 50 50 97 3 50Z" />
          </clipPath>
          <g clipPath={`url(#${clipId})`}>
            <rect width="100" height="100" fill="#fff" />
            <rect y="54" width="100" height="46" fill="#0b1626" />
          </g>
          <path d="M50 3 97 50 50 97 3 50Z" fill="none" stroke="#0b1626" strokeWidth="3" />
          {/* test tubes pouring */}
          <path d="M33 22 l8 8 M59 22 l-8 8" stroke="#0b1626" strokeWidth="4" strokeLinecap="round" />
          <path d="M38 36 q2 6 0 10 M62 36 q-2 6 0 10" stroke="#0b1626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <text x="50" y="86" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="Arial, sans-serif">8</text>
        </>
      )}
      {hazard === "5.1" && (
        <>
          <path d="M50 3 97 50 50 97 3 50Z" fill="#facc15" stroke="#0b1626" strokeWidth="3" />
          <circle cx="50" cy="48" r="9" fill="none" stroke="#0b1626" strokeWidth="3.5" />
          <path d="M50 18 c8 8 -2 12 4 20 M43 24 c-4 6 4 8 0 14" stroke="#0b1626" strokeWidth="3" fill="none" strokeLinecap="round" />
          <text x="50" y="84" textAnchor="middle" fontSize="15" fontWeight="700" fill="#0b1626" fontFamily="Arial, sans-serif">5.1</text>
        </>
      )}
      {hazard === "2.3" && (
        <>
          <path d="M50 3 97 50 50 97 3 50Z" fill="#fff" stroke="#0b1626" strokeWidth="3" />
          <circle cx="50" cy="38" r="11" fill="#0b1626" />
          <path d="M40 54 l20 12 M60 54 l-20 12" stroke="#0b1626" strokeWidth="4.5" strokeLinecap="round" />
          <text x="50" y="88" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b1626" fontFamily="Arial, sans-serif">2</text>
        </>
      )}
    </svg>
  );
}
