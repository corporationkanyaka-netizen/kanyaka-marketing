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
  const purityHeadline = /^as per/i.test(product.purity)
    ? "Per mfr. spec"
    : product.purity.split("(")[0].replace(/\s*Min\s*$/i, "").replace(/\s*-\s*/g, "–").trim();
  // Long formulas (e.g. CH₃COONa) step down a size so every tile stays one line tall.
  const symbolSize = symbol.length <= 5 ? "text-[2.25rem]" : symbol.length <= 7 ? "text-[1.9rem]" : "text-[1.6rem]";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md bg-white ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(11,22,38,0.35)]">
      {/* Periodic-table style element tile */}
      <Link
        href={`/products/${product.slug}`}
        className={`relative m-1.5 mb-0 block rounded-md bg-gradient-to-br ${tone.tile} p-4 ring-1 ring-black/5 transition-all ${tone.ring} group-hover:ring-2`}
      >
        <div className="flex h-9 items-start justify-between">
          <div className="font-mono text-[11px] leading-tight text-slate-500">
            {index !== undefined && (
              <div className={`text-sm font-semibold ${tone.text}`}>{String(index + 1).padStart(2, "0")}</div>
            )}
            <div>CAS {product.casNumber}</div>
          </div>
          {hazard ? (
            <HazardPlacard hazard={hazard} size={32} />
          ) : (
            <span className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
              Non-hazardous
            </span>
          )}
        </div>

        <div
          className={`my-3 flex h-11 items-center whitespace-nowrap font-display ${symbolSize} font-semibold leading-none tracking-tight text-ink-900 transition-transform duration-500 group-hover:scale-[1.04] origin-left`}
        >
          {symbol}
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-black/5 pt-2.5">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Purity</div>
            <div className="truncate font-mono text-base font-semibold text-ink-900">{purityHeadline}</div>
          </div>
          <div className="shrink-0 text-right font-mono text-[11px] leading-tight text-slate-500">
            <div>{physicalState(product)}</div>
            {un && <div>{un}</div>}
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <div className="mb-1.5 flex items-center gap-2 text-xs">
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
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 truncate text-[13px] text-slate-500" title={`${product.manufacturer} · ${product.packagingOptions[0]}`}>
          {product.manufacturer} · {product.packagingOptions[0]}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-3.5">
          <button
            onClick={() => onOpenQuote(product.name)}
            className="h-9 flex-1 cursor-pointer rounded-md bg-ink-900 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            Request price
          </button>
          <Link
            href={`/products/${product.slug}`}
            aria-label={`View specifications for ${product.name}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md ring-1 ring-line text-ink-900 transition-all hover:bg-ink-900 hover:text-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
