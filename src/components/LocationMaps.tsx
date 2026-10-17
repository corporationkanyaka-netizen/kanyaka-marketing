"use client";

import React, { useState } from "react";
import { companyInfo } from "@/data/company";
import { ArrowUpRight, Building2, Navigation, Warehouse, ZoomIn, ZoomOut } from "lucide-react";

type Location = (typeof companyInfo.locations)[number];

const satelliteSrc = (loc: Location, zoom: number) =>
  `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&t=k&z=${zoom}&hl=en&output=embed`;
const directionsHref = (loc: Location) =>
  `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
const openHref = (loc: Location) => `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;

/** Straight-line distance in km (haversine). */
function distanceKm(a: Location, b: Location) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const ZOOMS = [15, 17, 19];

export default function LocationMaps() {
  const locations = companyInfo.locations;
  const office = locations.find((l) => l.kind === "office") ?? locations[0];
  const [activeId, setActiveId] = useState<string>(locations[1]?.id ?? locations[0].id);
  const [zoomIdx, setZoomIdx] = useState(1);
  const active = locations.find((l) => l.id === activeId) ?? locations[0];

  // Overview projection: fit all pins into the SVG box.
  const lats = locations.map((l) => l.lat);
  const lngs = locations.map((l) => l.lng);
  const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const W = 320;
  const H = 220;
  const pad = 36;
  const scale = Math.min((W - pad * 2) / (maxLng - minLng), (H - pad * 2) / (maxLat - minLat));
  const project = (l: Location) => ({
    x: W / 2 + (l.lng - (minLng + maxLng) / 2) * scale,
    y: H / 2 - (l.lat - (minLat + maxLat) / 2) * scale,
  });

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Location list + overview */}
      <div className="order-2 flex flex-col gap-3 lg:order-none lg:col-span-4">
        {locations.map((loc) => {
          const Icon = loc.kind === "office" ? Building2 : Warehouse;
          const isActive = loc.id === active.id;
          const km = loc.id === office.id ? null : distanceKm(office, loc);
          return (
            <button
              key={loc.id}
              onClick={() => setActiveId(loc.id)}
              aria-pressed={isActive}
              className={`group flex w-full cursor-pointer items-start gap-4 rounded-md p-5 text-left transition-all ${
                isActive ? "bg-ink-900 text-white shadow-[0_20px_50px_-24px_rgba(11,22,38,0.6)]" : "bg-white ring-1 ring-line hover:ring-brand-300"
              }`}
            >
              <span
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-md ${
                  isActive ? "bg-brand-500/20 text-brand-300" : "bg-paper-2 text-ink-900"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className={`font-semibold ${isActive ? "text-white" : "text-ink-900"}`}>{loc.title}</span>
                  {km !== null && (
                    <span className={`shrink-0 font-mono text-xs ${isActive ? "text-slate-400" : "text-slate-500"}`}>
                      ~{Math.round(km)} km
                    </span>
                  )}
                </span>
                <span className={`mt-0.5 block text-sm ${isActive ? "text-slate-300" : "text-slate-600"}`}>{loc.place}</span>
                <span className={`mt-2 block font-mono text-xs ${isActive ? "text-brand-300" : "text-slate-400"}`}>{loc.dms}</span>
              </span>
            </button>
          );
        })}

        {/* Area overview */}
        <div className="rounded-md bg-white p-4 ring-1 ring-line">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">Area overview</span>
            <span className="font-mono text-xs text-slate-400">N ↑</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full" role="img" aria-label="Relative positions of the office and warehouses">
            <defs>
              <pattern id="ov-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" fill="none" stroke="#0b1626" strokeOpacity="0.06" />
              </pattern>
            </defs>
            <rect width={W} height={H} rx="6" fill="url(#ov-grid)" />
            {locations
              .filter((l) => l.id !== office.id)
              .map((l) => {
                const a = project(office);
                const b = project(l);
                const horizontal = Math.abs(b.x - a.x) > Math.abs(b.y - a.y);
                return (
                  <g key={l.id}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0ea5e9" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="4 5" />
                    <text
                      x={(a.x + b.x) / 2 + (horizontal ? 0 : 8)}
                      y={(a.y + b.y) / 2 + (horizontal ? 18 : 4)}
                      textAnchor={horizontal ? "middle" : "start"}
                      fontSize="11"
                      fill="#64748b"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {Math.round(distanceKm(office, l))} km
                    </text>
                  </g>
                );
              })}
            {locations.map((l) => {
              const p = project(l);
              const isActive = l.id === active.id;
              const labelLeft = p.x > W * 0.6;
              return (
                <g key={l.id} onClick={() => setActiveId(l.id)} className="cursor-pointer">
                  {isActive && <circle cx={p.x} cy={p.y} r="14" fill="#0ea5e9" opacity="0.18" className="animate-glow" />}
                  <circle cx={p.x} cy={p.y} r={isActive ? 7 : 5.5} fill={l.kind === "office" ? "#0b1626" : "#0ea5e9"} stroke="#fff" strokeWidth="2" />
                  <text
                    x={labelLeft ? p.x - 12 : p.x + 12}
                    y={p.y + 4}
                    textAnchor={labelLeft ? "end" : "start"}
                    fontSize="12"
                    fontWeight={isActive ? 600 : 500}
                    fill="#0b1626"
                  >
                    {l.title.replace(" Warehouse", "")}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="px-1 pt-1 text-xs text-slate-500">Distances are straight-line, from the office.</p>
        </div>
      </div>

      {/* Satellite view */}
      <div className="order-1 lg:order-none lg:col-span-8">
        <div className="relative h-[440px] overflow-hidden rounded-md bg-ink-900 ring-1 ring-line sm:h-[560px] lg:h-full lg:min-h-[600px]">
          <iframe
            key={`${active.id}-${ZOOMS[zoomIdx]}`}
            title={`Satellite view — Kanyaka Corporation ${active.title}`}
            src={satelliteSrc(active, ZOOMS[zoomIdx])}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Info overlay */}
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-3 sm:inset-x-4 sm:top-4">
            <div className="pointer-events-auto max-w-[75%] rounded-md bg-ink-950/85 px-3.5 py-2.5 text-white backdrop-blur-md sm:px-4 sm:py-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-300">Satellite view</div>
              <div className="mt-1 font-semibold">{active.title}</div>
              <div className="mt-0.5 hidden text-sm text-slate-300 sm:block">{active.lines.join(", ")}</div>
              <div className="mt-1 font-mono text-xs text-slate-400">
                {active.lat.toFixed(6)}, {active.lng.toFixed(6)}
              </div>
            </div>
            <div className="pointer-events-auto flex flex-col overflow-hidden rounded-md bg-ink-950/85 text-white backdrop-blur-md">
              <button
                onClick={() => setZoomIdx((z) => Math.min(z + 1, ZOOMS.length - 1))}
                disabled={zoomIdx === ZOOMS.length - 1}
                className="grid h-10 w-10 cursor-pointer place-items-center transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-40"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoomIdx((z) => Math.max(z - 1, 0))}
                disabled={zoomIdx === 0}
                className="grid h-10 w-10 cursor-pointer place-items-center border-t border-white/10 transition-colors hover:bg-white/10 disabled:cursor-default disabled:opacity-40"
                aria-label="Zoom out to see the surrounding area"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2 sm:inset-x-4 sm:bottom-4">
            <a
              href={directionsHref(active)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-ink-950 shadow-lg transition-colors hover:bg-brand-300"
            >
              <Navigation className="h-4 w-4" />
              Get directions
            </a>
            <a
              href={openHref(active)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-ink-950/85 px-5 py-3 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-ink-950"
            >
              Open in Google Maps
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
