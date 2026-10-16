"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import HazardPlacard from "@/components/chem/HazardPlacard";
import { categoryTone, hazardClass, physicalState, tileSymbol, unCode } from "@/lib/chem";

interface ProductCardProps {
  product: Product;
  onOpenQuote: (productName: string) => void;
  index?: number;
}

export default function ProductCard({ product, onOpenQuote, index }: ProductCardProps) {
  const tone = categoryTone[product.category];
  const hazard = hazardClass(product);
  const un = unCode(product);
  const symbol = tileSymbol(product);
  const purityHeadline = product.purity
    .split("(")[0]
    .replace(/\s*Min\s*$/i, "")
    .replace(/Available Chlorine/i, "av. Cl")
    .replace(/\s*-\s*/g, "–")
    .trim();

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(11,22,38,0.35)]">
      {/* Periodic-table style element tile */}
      <Link
        href={`/products/${product.slug}`}
        className={`relative m-2 mb-0 block rounded-xl bg-gradient-to-br ${tone.tile} p-5 ring-1 ring-black/5 transition-all ${tone.ring} group-hover:ring-2`}
      >
        <div className="flex items-start justify-between">
          <div className="font-mono text-[11px] leading-tight text-slate-500">
            {index !== undefined && (
              <div className={`text-sm font-semibold ${tone.text}`}>{String(index + 1).padStart(2, "0")}</div>
            )}
            <div>CAS {product.casNumber}</div>
          </div>
          {hazard ? (
            <HazardPlacard hazard={hazard} size={36} />
          ) : (
            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
              Non-hazardous
            </span>
          )}
        </div>

        <div className="mt-6 mb-5 font-display text-[2.6rem] font-semibold leading-none tracking-tight text-ink-900 transition-transform duration-500 group-hover:scale-[1.04] origin-left">
          {symbol}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-black/5 pt-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Assay</div>
            <div className="font-mono text-lg font-semibold text-ink-900">{purityHeadline}</div>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-500">
            <div>{physicalState(product)}</div>
            {un && <div>{un}</div>}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="mb-2 flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
          <span className="font-medium text-slate-500">{tone.label}</span>
          {product.isGrasimAuthorized && (
            <span className="ml-auto inline-flex items-center gap-1 font-medium text-amber-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Grasim
            </span>
          )}
        </div>

        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{product.grade}</p>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <button
            onClick={() => onOpenQuote(product.name)}
            className="flex-1 cursor-pointer rounded-full bg-ink-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Request price
          </button>
          <Link
            href={`/products/${product.slug}`}
            aria-label={`View specifications for ${product.name}`}
            className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-line text-ink-900 transition-all hover:bg-ink-900 hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
