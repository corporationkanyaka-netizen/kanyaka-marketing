"use client";

import React, { useState } from "react";
import Link from "next/link";
import { industriesData } from "@/data/industries";
import { productsData, Product } from "@/data/products";
import { categoryTone, tileSymbol } from "@/lib/chem";
import Reveal from "@/components/chem/Reveal";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Check,
  Droplets,
  FlaskConical,
  Milk,
  Pill,
  Printer,
  Shield,
  Shirt,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";

interface ChemicalFinderProps {
  onOpenQuote: (productName: string) => void;
}

const sectorIcons: Record<string, LucideIcon> = {
  Bug,
  Pill,
  Sprout,
  Shirt,
  Shield,
  Printer,
  Milk,
  Wrench,
  Droplets,
};

export default function ChemicalFinder({ onOpenQuote }: ChemicalFinderProps) {
  const [selectedIndustrySlug, setSelectedIndustrySlug] = useState<string>(industriesData[0].slug);

  const sector = industriesData.find((ind) => ind.slug === selectedIndustrySlug) || industriesData[0];
  const matchingProducts: Product[] = productsData.filter((prod) => sector.recommendedProductSlugs.includes(prod.slug));
  const SectorIcon = sectorIcons[sector.iconName] ?? FlaskConical;

  return (
    <div>
      <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">04 — Industries we serve</div>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">The right grade for every process line.</h2>
        </div>
        <p className="max-w-md text-lg leading-relaxed text-slate-400">
          Pick your sector to see the chemicals it typically uses — all available from us.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sector list */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {industriesData.map((ind) => {
            const Icon = sectorIcons[ind.iconName] ?? FlaskConical;
            const active = ind.slug === selectedIndustrySlug;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustrySlug(ind.slug)}
                className={`group flex shrink-0 cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-left transition-all lg:w-full ${
                  active ? "bg-white text-ink-950" : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-md transition-colors ${
                    active ? "bg-ink-900 text-brand-300" : "bg-white/5 text-slate-400 group-hover:text-brand-300"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <span className="whitespace-nowrap text-sm font-medium lg:whitespace-normal">{ind.name}</span>
                <ArrowRight className={`ml-auto hidden h-4 w-4 shrink-0 lg:block ${active ? "text-brand-600" : "opacity-0"}`} />
              </button>
            );
          })}
        </div>

        {/* Sector detail */}
        <div className="lg:col-span-8">
          <div key={sector.slug} className="relative overflow-hidden rounded-md border border-white/10 bg-ink-900 p-6 sm:p-10">
            <div className="hex-lattice mask-fade-b absolute inset-0 opacity-70" />
            <SectorIcon className="absolute -right-6 -top-6 h-48 w-48 text-white/[0.03]" strokeWidth={1} />

            <div className="relative">
              <h3 className="text-2xl font-semibold sm:text-3xl">{sector.name}</h3>
              <p className="mt-2 text-brand-300">{sector.tagline}</p>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-300">{sector.overview}</p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sector.benefitsWithKanyaka.slice(0, 4).map((benefit) => (
                  <div key={benefit} className="flex gap-3 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-reagent" />
                    {benefit}
                  </div>
                ))}
              </div>

              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                    Recommended · {matchingProducts.length} grades
                  </div>
                  <Link
                    href={`/industries#${sector.slug}`}
                    className="group hidden items-center gap-1 text-sm text-slate-300 hover:text-white sm:inline-flex"
                  >
                    Sector details
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {matchingProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group relative rounded-md border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-white/25 hover:bg-white/[0.07]"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: categoryTone[prod.category].hex }}
                        />
                        <button
                          onClick={() => onOpenQuote(prod.name)}
                          className="cursor-pointer text-xs text-slate-500 opacity-0 transition-opacity hover:text-white group-hover:opacity-100"
                        >
                          Quote
                        </button>
                      </div>
                      <Link href={`/products/${prod.slug}`} className="block">
                        <div className="mt-3 font-display text-2xl font-semibold">{tileSymbol(prod)}</div>
                        <div className="mt-1 line-clamp-1 text-xs text-slate-400">{prod.name.split("(")[0].trim()}</div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
