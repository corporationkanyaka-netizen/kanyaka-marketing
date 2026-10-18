"use client";

import React, { useState, useMemo } from "react";
import { productsData } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useModals } from "@/components/ClientShell";
import Reveal from "@/components/chem/Reveal";
import BrandKicker from "@/components/BrandKicker";
import MoleculeHero from "@/components/chem/MoleculeHero";
import Flask from "@/components/chem/Flask";
import { categoryTone, productCategories } from "@/lib/chem";
import type { ProductCategory } from "@/data/products";
import { Search, ShieldCheck, Download, FlaskConical, ArrowRight, X } from "lucide-react";

const categories: ("All" | ProductCategory)[] = ["All", ...productCategories];

export default function ProductsPage() {
  const { openQuote, openBrochure } = useModals();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [onlyGrasim, setOnlyGrasim] = useState(false);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.synonyms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.chemicalFormula.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.casNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.grade.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

      const matchesGrasim = !onlyGrasim || product.isGrasimAuthorized;

      return matchesSearch && matchesCategory && matchesGrasim;
    });
  }, [searchQuery, selectedCategory, onlyGrasim]);

  const grasimCount = productsData.filter((p) => p.isGrasimAuthorized).length;
  const godownCount = productsData.filter((p) => p.fromGodown).length;

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="grain relative isolate overflow-hidden bg-ink-950 text-white">
        <div className="lab-grid-dark mask-radial absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-10 -z-10 h-[480px] w-[480px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-reagent/10 blur-[120px]" />
        <MoleculeHero className="pointer-events-none absolute -right-40 top-1/2 -z-10 hidden h-[620px] w-[620px] -translate-y-1/2 opacity-40 lg:block" />

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <BrandKicker label={`Product catalogue · ${productsData.length} products`} />
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-7 text-5xl font-medium leading-[1.0] tracking-[-0.04em] sm:text-6xl">
                Industrial chemicals,
                <br />
                <span className="text-reagent">catalogued like elements.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                <strong className="font-semibold text-white">Kanyaka Corporation</strong> supplies chloro-alkali products, acids and specialty
                chemicals to Indian industry as an authorised dealer of Grasim Industries Ltd. {godownCount} products are held as stock at our
                own 6,000 sq.ft. warehouse near Pashamylaram.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white py-3.5 pl-6 pr-5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-300"
                >
                  Bulk quantity RFQ
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={openBrochure}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Download className="h-4 w-4 text-brand-300" />
                  View product list
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={400}>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-amber-glow" />
                Authorised dealer · Grasim Industries Ltd.
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.16em]">
                {grasimCount} Grasim products
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.16em]">{godownCount} in godown stock</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FILTERS + GRID ═══════════════ */}
      <section className="hex-lattice-light relative py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search + Grasim toggle */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                aria-label="Search chemicals"
                placeholder="Search by name, formula (NaOH), CAS number or grade…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-white py-4 pl-14 pr-24 text-[15px] text-ink-900 shadow-[0_12px_40px_-24px_rgba(11,22,38,0.35)] outline-none ring-1 ring-line transition-shadow placeholder:text-slate-400 focus:ring-2 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-paper hover:text-ink-900"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}
            </div>

            <label
              className={`inline-flex shrink-0 cursor-pointer select-none items-center gap-3 rounded-md px-5 py-4 text-sm font-medium transition-colors ${
                onlyGrasim ? "bg-ink-900 text-white" : "bg-white text-ink-900 ring-1 ring-line hover:bg-paper-2"
              }`}
            >
              <input
                type="checkbox"
                checked={onlyGrasim}
                onChange={(e) => setOnlyGrasim(e.target.checked)}
                className="h-4 w-4 rounded-md border-line accent-brand-600"
              />
              <ShieldCheck className={`h-4 w-4 ${onlyGrasim ? "text-amber-glow" : "text-amber-600"}`} />
              Grasim products only
            </label>
          </div>

          {/* Category pills */}
          <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              const tone = cat === "All" ? null : categoryTone[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    active ? "bg-ink-900 text-white" : "bg-white text-slate-600 ring-1 ring-line hover:text-ink-900"
                  }`}
                >
                  {tone ? (
                    <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                  ) : (
                    <span className="text-brand-500">⬡</span>
                  )}
                  {tone ? tone.label : "All elements"}
                  <span className="font-mono text-xs text-slate-400">
                    {cat === "All" ? productsData.length : productsData.filter((p) => p.category === cat).length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results counter */}
          <div className="mt-8 flex flex-col gap-1 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-[15px] text-slate-600">
              Showing <span className="font-mono font-medium text-ink-900">{filteredProducts.length}</span> of{" "}
              <span className="font-mono">{productsData.length}</span> chemical grades
            </p>
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
              Specs shown are typical · manufacturer&apos;s COA is final
            </span>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, i) => (
                <Reveal key={product.id} delay={(i % 4) * 70} className="h-full">
                  <ProductCard product={product} index={productsData.indexOf(product)} onOpenQuote={openQuote} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-md bg-white px-6 py-10 text-center ring-1 ring-line sm:py-12">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-md bg-ink-900 text-brand-300">
                <FlaskConical className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <h3 className="mt-6 text-2xl font-medium text-ink-900">No chemicals found</h3>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-slate-600">
                We could not find any products matching &ldquo;{searchQuery}&rdquo;. Try another term, or call us to
                ask about it.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setOnlyGrasim(false);
                }}
                className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-md bg-ink-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="grain relative isolate overflow-hidden rounded-md bg-gradient-to-br from-brand-700 via-ink-700 to-ink-950 px-6 py-12 text-white sm:px-10 sm:py-12">
            <div className="lab-grid-dark absolute inset-0 -z-10 opacity-60" />
            <Flask className="pointer-events-none absolute -bottom-6 -right-6 -z-10 hidden h-56 w-56 opacity-70 sm:block" />
            <div className="max-w-2xl">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">Not on the list?</div>
              <h2 className="mt-4 text-4xl font-medium leading-[1.05] sm:text-5xl">
                Need a chemical or quantity not shown here?
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-sky-100/80">
                Tell us the product, grade and quantity. We will confirm availability and price when you enquire.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white py-3.5 pl-6 pr-5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-300"
                >
                  Request a quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={openBrochure}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Download className="h-4 w-4" />
                  View product list
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
