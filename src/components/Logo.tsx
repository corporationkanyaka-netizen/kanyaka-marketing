import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light-bg" | "dark-bg" | "mark-only";
  showTagline?: boolean;
}

export default function Logo({
  className = "",
  size = "md",
  variant = "light-bg",
  showTagline = true,
}: LogoProps) {
  // Dimension scales
  const dimensions = {
    sm: { markW: 32, markH: 30, textClass: "text-base", subClass: "text-[9px]" },
    md: { markW: 42, markH: 38, textClass: "text-xl", subClass: "text-[10px]" },
    lg: { markW: 56, markH: 50, textClass: "text-2xl", subClass: "text-xs" },
  }[size];

  const isDarkBg = variant === "dark-bg";
  const textColor = isDarkBg ? "text-white" : "text-[#0f1f38]";
  const corpColor = isDarkBg ? "text-slate-200" : "text-[#1e293b]";
  const subTextColor = isDarkBg ? "text-slate-300" : "text-[#64748b]";

  // The precise KC mark: Red tapered bar + Cyan-Blue K with Crescent 'C' inside
  const MarkSVG = (
    <svg
      width={dimensions.markW}
      height={dimensions.markH}
      viewBox="0 0 160 144"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-label="Kanyaka Corporation KC Mark"
    >
      {/* Red vertical tapered column */}
      <polygon
        points="16,10 44,10 40,134 26,134"
        fill="#DC2626"
      />
      {/* Cyan-Blue 'K' spine and diagonals */}
      {/* K vertical trunk */}
      <rect x="49" y="10" width="22" height="124" fill="#0EA5E9" />
      {/* K upper diagonal */}
      <polygon
        points="69,82 138,10 164,10 93,82"
        fill="#0EA5E9"
      />
      {/* K lower diagonal */}
      <polygon
        points="85,72 165,134 135,134 68,76"
        fill="#0EA5E9"
      />
      {/* White / Background crescent cutout forming the 'C' inside the K */}
      <path
        d="M 104,48 C 84,48 76,64 76,74 C 76,84 84,100 104,100 C 92,94 88,84 88,74 C 88,64 92,54 104,48 Z"
        fill={isDarkBg ? "#040b16" : "#f5f4ef"}
      />
    </svg>
  );

  if (variant === "mark-only") {
    return <div className={`inline-flex items-center ${className}`}>{MarkSVG}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {MarkSVG}
      <div className="flex flex-col leading-none">
        <span className={`font-display font-semibold tracking-tight ${dimensions.textClass} ${textColor}`}>
          Kanyaka
        </span>
        <span
          className={`font-semibold tracking-[0.22em] uppercase mt-0.5 ${dimensions.subClass} ${corpColor}`}
        >
          CORPORATION
        </span>
        {showTagline && (
          <>
            <div className="w-9 h-[2px] bg-[#DC2626] mt-1 mb-0.5 rounded-md" />
            <span className={`text-[9px] font-medium tracking-wide ${subTextColor}`}>
              Chemicals &amp; Solvents
            </span>
          </>
        )}
      </div>
    </div>
  );
}
