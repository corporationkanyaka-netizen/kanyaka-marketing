import React from "react";

/*
  Decorative aromatic molecule for the hero: a benzene ring with substituents,
  CPK-coloured atoms, orbit rings and an instrument-style dial around it.
  Pure SVG + CSS animation, so it renders on the server and costs no JS.
*/

type Element = "C" | "O" | "Cl" | "Na" | "H";

const atomStyle: Record<Element, { r: number; light: string; dark: string; label: string }> = {
  C: { r: 22, light: "#5b6b84", dark: "#16233a", label: "#e2e8f0" },
  O: { r: 25, light: "#fca5a5", dark: "#b91c1c", label: "#fff" },
  Cl: { r: 29, light: "#99f6e4", dark: "#0f766e", label: "#042f2e" },
  Na: { r: 31, light: "#c4b5fd", dark: "#5b21b6", label: "#fff" },
  H: { r: 14, light: "#ffffff", dark: "#94a3b8", label: "#0b1626" },
};

const ring: [number, number][] = [
  [300, 208],
  [379.7, 254],
  [379.7, 346],
  [300, 392],
  [220.3, 346],
  [220.3, 254],
];

const atoms: { el: Element; x: number; y: number }[] = [
  ...ring.map(([x, y]) => ({ el: "C" as Element, x, y })),
  { el: "O", x: 300, y: 126 },
  { el: "H", x: 356, y: 92 },
  { el: "Cl", x: 452, y: 210 },
  { el: "O", x: 452, y: 390 },
  { el: "Na", x: 534, y: 440 },
  { el: "H", x: 300, y: 470 },
  { el: "Cl", x: 148, y: 390 },
  { el: "H", x: 158, y: 216 },
];

const bonds: { a: [number, number]; b: [number, number]; ionic?: boolean }[] = [
  ...ring.map((p, i) => ({ a: p, b: ring[(i + 1) % 6] })),
  { a: ring[0], b: [300, 126] },
  { a: [300, 126], b: [356, 92] },
  { a: ring[1], b: [452, 210] },
  { a: ring[2], b: [452, 390] },
  { a: [452, 390], b: [534, 440], ionic: true },
  { a: ring[3], b: [300, 470] },
  { a: ring[4], b: [148, 390] },
  { a: ring[5], b: [158, 216] },
];

const ticks = Array.from({ length: 90 }, (_, i) => i * 4);

export default function MoleculeHero({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" className={className} role="img" aria-label="Animated molecular structure">
      <defs>
        {(Object.keys(atomStyle) as Element[]).map((el) => (
          <radialGradient key={el} id={`atom-${el}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={atomStyle[el].light} />
            <stop offset="100%" stopColor={atomStyle[el].dark} />
          </radialGradient>
        ))}
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bond-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd8f6" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="300" cy="300" r="250" fill="url(#core-glow)" />

      {/* Instrument dial */}
      <g opacity="0.55">
        <circle cx="300" cy="300" r="286" fill="none" stroke="#7dd8f6" strokeOpacity="0.18" />
        <g className="animate-orbit-rev">
          {ticks.map((deg) => (
            <line
              key={deg}
              x1="300"
              y1={deg % 20 === 0 ? 4 : 9}
              x2="300"
              y2="16"
              stroke="#7dd8f6"
              strokeOpacity={deg % 20 === 0 ? 0.5 : 0.22}
              strokeWidth="1.2"
              transform={`rotate(${deg} 300 300)`}
            />
          ))}
        </g>
      </g>

      {/* Electron orbits */}
      <g className="animate-orbit">
        <ellipse cx="300" cy="300" rx="262" ry="92" fill="none" stroke="#7dd8f6" strokeOpacity="0.22" strokeDasharray="2 7" transform="rotate(-28 300 300)" />
        <circle cx="531" cy="177" r="5" fill="#7dd8f6" filter="url(#soft-glow)" />
      </g>
      <g className="animate-orbit-rev">
        <ellipse cx="300" cy="300" rx="250" ry="80" fill="none" stroke="#2dd4bf" strokeOpacity="0.18" strokeDasharray="1 6" transform="rotate(34 300 300)" />
        <circle cx="93" cy="160" r="4" fill="#2dd4bf" filter="url(#soft-glow)" />
      </g>

      <g className="animate-float-slow">
        {/* Aromatic ring */}
        <circle cx="300" cy="300" r="54" fill="none" stroke="url(#bond-grad)" strokeWidth="2" strokeDasharray="5 6" className="animate-bond" />

        {bonds.map(({ a, b, ionic }, i) => (
          <line
            key={i}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke={ionic ? "#c4b5fd" : "url(#bond-grad)"}
            strokeWidth={ionic ? 2 : 5}
            strokeLinecap="round"
            strokeDasharray={ionic ? "3 7" : undefined}
            className="animate-bond"
            style={{ animationDelay: `${(i % 6) * 0.4}s` }}
          />
        ))}

        {atoms.map(({ el, x, y }, i) => {
          const s = atomStyle[el];
          return (
            <g key={i}>
              <circle cx={x} cy={y + 4} r={s.r} fill="#000" opacity="0.25" />
              <circle cx={x} cy={y} r={s.r} fill={`url(#atom-${el})`} />
              <circle cx={x - s.r * 0.35} cy={y - s.r * 0.4} r={s.r * 0.22} fill="#fff" opacity="0.45" />
              {el !== "C" && (
                <text
                  x={x}
                  y={y + (el === "H" ? 4 : 6)}
                  textAnchor="middle"
                  fontSize={el === "H" ? 11 : 16}
                  fontWeight="700"
                  fill={s.label}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {el}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
