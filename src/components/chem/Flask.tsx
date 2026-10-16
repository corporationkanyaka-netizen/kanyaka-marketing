import React from "react";

const bubbles = [
  { cx: 92, r: 5, dur: 4.2, delay: 0 },
  { cx: 118, r: 3.5, dur: 3.4, delay: 1.1 },
  { cx: 104, r: 6, dur: 5.2, delay: 2.0 },
  { cx: 132, r: 4, dur: 4.6, delay: 0.6 },
  { cx: 80, r: 3, dur: 3.8, delay: 2.7 },
];

/** Erlenmeyer flask with a moving liquid surface and rising bubbles. */
export default function Flask({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 260" className={className} aria-hidden="true">
      <defs>
        <clipPath id="flask-inner">
          <path d="M86 20 h48 v62 l62 128 q8 20 -14 22 H38 q-22 -2 -14 -22 l62 -128z" />
        </clipPath>
        <linearGradient id="flask-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0f766e" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="flask-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.16" />
        </linearGradient>
      </defs>

      <g clipPath="url(#flask-inner)">
        <rect width="220" height="260" fill="url(#flask-glass)" />
        <g className="animate-wave">
          <path
            d="M0 140 q27.5 -12 55 0 t55 0 t55 0 t55 0 t55 0 t55 0 t55 0 t55 0 V260 H0z"
            fill="url(#flask-liquid)"
          />
          <path
            d="M0 146 q27.5 10 55 0 t55 0 t55 0 t55 0 t55 0 t55 0 t55 0 t55 0 V260 H0z"
            fill="#0ea5e9"
            opacity="0.35"
          />
        </g>
        {bubbles.map((b, i) => (
          <circle
            key={i}
            cx={b.cx}
            cy={226}
            r={b.r}
            fill="#e0f2fe"
            fillOpacity="0.7"
            className="animate-bubble"
            style={{ animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </g>

      {/* glass outline */}
      <path
        d="M86 20 h48 v62 l62 128 q8 20 -14 22 H38 q-22 -2 -14 -22 l62 -128z"
        fill="none"
        stroke="#e0f2fe"
        strokeOpacity="0.7"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="78" y="10" width="64" height="12" rx="4" fill="none" stroke="#e0f2fe" strokeOpacity="0.7" strokeWidth="3" />
      {/* graduation marks */}
      {[150, 172, 194].map((y) => (
        <line key={y} x1="58" x2="74" y1={y} y2={y} stroke="#e0f2fe" strokeOpacity="0.55" strokeWidth="2" />
      ))}
      <path d="M96 40 v36" stroke="#fff" strokeOpacity="0.35" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
