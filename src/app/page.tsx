"use client";

import React, { useState } from "react";
import Link from "next/link";
import { productsData } from "@/data/products";
import { companyInfo } from "@/data/company";
import ProductCard from "@/components/ProductCard";
import ChemicalFinder from "@/components/ChemicalFinder";
import { useModals } from "@/components/ClientShell";
import MoleculeHero from "@/components/chem/MoleculeHero";
import Flask from "@/components/chem/Flask";
import Reveal from "@/components/chem/Reveal";
import HazardPlacard from "@/components/chem/HazardPlacard";
import { categoryTone, hazardClass, productCategories, tileSymbol } from "@/lib/chem";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Factory,
  FileCheck2,
  Phone,
  Truck,
  Warehouse,
  Download,
  Quote,
} from "lucide-react";

const categories = ["All", ...productCategories] as const;

const specSlugs = ["caustic-soda-flakes", "aluminium-chloride-granules", "thionyl-chloride", "sodium-sulphate-anhydrous"];

const statBorders = ["", "border-l pl-6", "border-t lg:border-l lg:border-t-0 lg:pl-6", "border-l border-t pl-6 lg:border-t-0"];

const processSteps = [
  {
    icon: Factory,
    title: "From the manufacturer",
    body: "Authorised dealer of Grasim Industries and Aditya Birla Chemicals, with allied products from Tata, Andhra Sugars, RCF and Kutch Chemicals.",
  },
  {
    icon: Warehouse,
    title: "Stocked at our godown",
    body: "Grasim and Aditya Birla products are held at our 6,000 sq.ft. warehouse near the Pashamylaram industrial estate.",
  },
  {
    icon: FileCheck2,
    title: "Genuine material",
    body: "Original manufacturer's packing and grade — ask for the manufacturer's COA with your quote.",
  },
  {
    icon: Truck,
    title: "Delivered to your plant",
    body: "Supplying manufacturing units across Telangana and Andhra Pradesh, at a reasonable price.",
  },
];

export default function HomePage() {
  const { openQuote, openBrochure } = useModals();
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("All");
  const [specSlug, setSpecSlug] = useState(specSlugs[0]);

  const specProducts = specSlugs
    .map((slug) => productsData.find((p) => p.slug === slug))
    .filter((p): p is (typeof productsData)[number] => Boolean(p));
  const spec = specProducts.find((p) => p.slug === specSlug) ?? specProducts[0];
  const specHazard = hazardClass(spec);

  const filteredProducts = activeCategory === "All" ? productsData : productsData.filter((p) => p.category === activeCategory);
  const stats = [companyInfo.stats[0], companyInfo.stats[2], companyInfo.stats[1], companyInfo.stats[4]];
  const tel = `tel:${companyInfo.contacts.phonePrimary.replace(/[^0-9+]/g, "")}`;
  const whatsapp = `https://wa.me/${companyInfo.contacts.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="grain relative isolate overflow-hidden bg-ink-950 text-white">
        <div className="lab-grid-dark mask-radial absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-20 -z-10 h-[520px] w-[520px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-20 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-reagent/10 blur-[120px]" />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-12 lg:gap-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-4 text-xs text-slate-300 backdrop-blur">
                <span className="shrink-0 whitespace-nowrap rounded-md bg-brand-500/20 px-2.5 py-0.5 font-mono text-brand-300">Authorised dealer</span>
                Chlor-alkali · Specialty chemicals · Acids
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-7 text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.4rem]">
                Pure chemistry.
                <br />
                <span className="text-reagent">Delivered on time.</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300">
                Authorised dealer of Grasim Industries and Aditya Birla Chemicals for Telangana &amp; Andhra Pradesh.
                Caustic soda, aluminium chloride, calcium chloride and {productsData.length - 3} more chemicals — genuine and quality products at a
                reasonable price.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white py-3.5 pl-6 pr-5 text-sm font-semibold text-ink-950 transition-all hover:bg-brand-300"
                >
                  Request a quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Explore {productsData.length} chemicals
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-12 border-t border-white/10 pt-6">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Authorized by</div>
                <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-2 font-display text-lg text-slate-300">
                  <span>Grasim Industries</span>
                  <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                  <span>Aditya Birla Chemicals</span>
                  <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
                  <span>Tata Chemicals</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Molecule */}
          <div className="relative lg:col-span-6">
            <div className="relative mx-auto aspect-square w-full max-w-[560px]">
              <MoleculeHero className="h-full w-full" />

              <div className="animate-float-slow absolute left-0 top-[14%] hidden rounded-md border border-white/10 bg-ink-900/70 px-4 py-3 backdrop-blur-md sm:block">
                <div className="font-mono text-[11px] uppercase tracking-wider text-slate-400">Typical assay · NaOH</div>
                <div className="font-display text-2xl font-semibold">
                  98.5<span className="text-brand-300">%</span>
                </div>
              </div>

              <div
                className="animate-float-slow absolute bottom-[12%] right-0 hidden rounded-md border border-white/10 bg-ink-900/70 px-4 py-3 backdrop-blur-md sm:block"
                style={{ animationDelay: "-4s" }}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Depot stocked
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-slate-400">Pashamylaram · 6,000 sq.ft.</div>
              </div>

              <div className="absolute bottom-[2%] left-[6%] hidden items-center gap-2 font-mono text-[11px] text-slate-500 md:flex">
                <span className="h-px w-8 bg-slate-600" />
                fig. 01 — chlorinated aromatic, CPK model
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 80}
                className={`border-white/10 py-8 lg:py-10 ${statBorders[i]}`}
              >
                <div className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FORMULA MARQUEE ═══════════════ */}
      <div className="overflow-hidden border-b border-line bg-paper py-6">
        <div className="animate-marquee gap-12">
          {[...productsData, ...productsData].map((p, i) => (
            <div key={`${p.id}-${i}`} className="flex shrink-0 items-baseline gap-4">
              <span className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">{tileSymbol(p)}</span>
              <span className="text-sm text-slate-500">{p.name.split("(")[0].trim()}</span>
              <span className="ml-8 text-2xl text-brand-500/60">⬡</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ PERIODIC CATALOG ═══════════════ */}
      <section className="hex-lattice-light relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">01 — The catalogue</div>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">
                A periodic table of everything we keep in stock.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {productsData.length} industrial chemicals from Grasim, Tata, Andhra Sugars, TGV and other leading manufacturers — each with its specification sheet.
              </p>
            </div>
            <button
              onClick={openBrochure}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-md px-5 py-3 text-sm font-medium text-ink-900 ring-1 ring-line transition-colors hover:bg-white lg:self-auto"
            >
              <Download className="h-4 w-4 text-brand-600" />
              Download product line card
            </button>
          </Reveal>

          {/* Category legend / filter */}
          <Reveal delay={100} className="no-scrollbar -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              const tone = cat === "All" ? null : categoryTone[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                    active ? "bg-ink-900 text-white" : "bg-white text-slate-600 ring-1 ring-line hover:text-ink-900"
                  }`}
                >
                  {tone ? <span className={`h-2 w-2 rounded-full ${tone.dot}`} /> : <span className="text-brand-500">⬡</span>}
                  {tone ? tone.label : "All elements"}
                  <span className={`font-mono text-xs ${active ? "text-slate-400" : "text-slate-400"}`}>
                    {cat === "All" ? productsData.length : productsData.filter((p) => p.category === cat).length}
                  </span>
                </button>
              );
            })}
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.slice(0, 8).map((product, i) => (
              <Reveal key={product.id} delay={(i % 4) * 70} className="h-full">
                <ProductCard product={product} index={productsData.indexOf(product)} onOpenQuote={openQuote} />
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-md bg-ink-900 py-3.5 pl-6 pr-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              View the full catalogue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ SPEC SHEET ═══════════════ */}
      <section className="relative overflow-hidden bg-paper-2 py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
          <Reveal className="lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">02 — Know what you&apos;re buying</div>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">
              Genuine products, clear specifications.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Every product comes from a named manufacturer in its original packing. Check the typical specification here, and
              ask for the manufacturer&apos;s COA with your quote.
            </p>

            <div className="mt-10 space-y-2">
              {specProducts.map((p) => {
                const active = p.slug === spec.slug;
                return (
                  <button
                    key={p.slug}
                    onClick={() => setSpecSlug(p.slug)}
                    className={`flex w-full cursor-pointer items-center justify-between rounded-md px-5 py-4 text-left transition-all ${
                      active ? "bg-white shadow-[0_12px_40px_-20px_rgba(11,22,38,0.4)] ring-1 ring-line" : "hover:bg-white/60"
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`w-20 font-display text-xl font-semibold ${active ? "text-brand-700" : "text-slate-400"}`}>
                        {tileSymbol(p)}
                      </span>
                      <span className={`text-sm font-medium ${active ? "text-ink-900" : "text-slate-600"}`}>{p.name}</span>
                    </span>
                    <ArrowRight className={`h-4 w-4 transition-all ${active ? "text-brand-600" : "text-slate-300"}`} />
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* The "lab report" */}
          <Reveal delay={150} className="lg:col-span-7">
            <div className="relative">
              <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md bg-ink-900/5" />
              <div className="lab-grid-light relative overflow-hidden rounded-md bg-white p-6 shadow-[0_40px_80px_-40px_rgba(11,22,38,0.45)] ring-1 ring-line sm:p-10">
                <div className="flex items-start justify-between gap-4 border-b-2 border-ink-900 pb-5">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500">Typical specification</div>
                    <h3 className="mt-2 text-2xl font-semibold text-ink-900 sm:text-3xl">{spec.name}</h3>
                    <div className="mt-1 text-sm text-slate-500">{spec.manufacturer}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl font-semibold text-brand-700 sm:text-4xl">{tileSymbol(spec)}</div>
                    <div className="mt-1 font-mono text-xs text-slate-500">CAS {spec.casNumber}</div>
                  </div>
                </div>

                <table className="mt-2 w-full text-sm">
                  <thead>
                    <tr className="text-left font-mono text-[11px] uppercase tracking-wider text-slate-400">
                      <th className="py-3 font-normal">Parameter</th>
                      <th className="py-3 text-right font-normal">Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spec.keySpecs.slice(0, 6).map((row) => (
                      <tr key={row.parameter} className="border-t border-dashed border-line">
                        <td className="py-3 pr-4 text-slate-700">{row.parameter}</td>
                        <td className="py-3 text-right font-mono font-medium text-ink-900">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-6 flex flex-col gap-5 border-t-2 border-ink-900 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {specHazard && <HazardPlacard hazard={specHazard} size={44} />}
                    <div className="text-xs leading-relaxed text-slate-500">
                      <div className="font-mono">{spec.unNumber}</div>
                      <div>{spec.packagingOptions[0]}</div>
                    </div>
                  </div>
                  <Link
                    href={`/products/${spec.slug}`}
                    className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-700"
                  >
                    Full datasheet
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Stamp */}
                <div className="pointer-events-none absolute right-6 top-28 hidden rotate-[-12deg] rounded-md border-2 border-emerald-600/60 px-3 py-1.5 text-center font-mono text-[11px] font-semibold uppercase leading-tight tracking-wider text-emerald-700/80 sm:block">
                  Typical
                  <br />
                  spec
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ PROCESS ═══════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">03 — The reaction path</div>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">From their reactor to your plant, in four steps.</h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-line ring-1 ring-line md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90} className="group relative bg-paper p-8 transition-colors hover:bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-400">0{i + 1}</span>
                  {i < processSteps.length - 1 && (
                    <span className="hidden font-mono text-lg text-brand-500 lg:block" aria-hidden="true">
                      ⟶
                    </span>
                  )}
                </div>
                <div className="mt-10 grid h-14 w-14 place-items-center rounded-md bg-ink-900 text-brand-300 transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105">
                  <step.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INDUSTRIES ═══════════════ */}
      <section className="bg-ink-950 py-24 text-white sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ChemicalFinder onOpenQuote={openQuote} />
        </div>
      </section>

      {/* ═══════════════ PARTNERS ═══════════════ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">05 — Our principals</div>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">Authorized by the names industry trusts.</h2>
            <p className="mt-5 text-lg text-slate-600">Authorised dealerships with the Aditya Birla Group, plus products from other leading Indian and overseas manufacturers.</p>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
            {companyInfo.authorizedPartners.map((partner, i) => (
              <Reveal key={partner.name} delay={i * 100}>
                <div className="group flex h-full flex-col rounded-md bg-white p-8 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,22,38,0.35)]">
                  <div className="flex items-center justify-between">
                    <BadgeCheck className={`h-7 w-7 ${i === 0 ? "text-amber-500" : "text-brand-500"}`} strokeWidth={1.6} />
                    <span className="font-mono text-xs text-slate-400">{partner.parent}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold leading-tight text-ink-900">{partner.name.split("(")[0].trim()}</h3>
                  <div className="mt-1 text-sm font-medium text-brand-700">{partner.tier}</div>
                  <p className="mt-5 flex-1 text-[15px] leading-relaxed text-slate-600">{partner.products}</p>
                  <button
                    onClick={() => openQuote(i === 0 ? "Caustic Soda Flakes" : i === 1 ? "Aluminium Chloride (Powder & Granule)" : undefined)}
                    className="mt-8 inline-flex cursor-pointer items-center gap-1.5 self-start text-sm font-medium text-ink-900 transition-colors group-hover:text-brand-700"
                  >
                    Enquire about this range
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOUNDER & DEPOT ═══════════════ */}
      <section className="pb-24 sm:pb-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-7">
            <div className="flex h-full flex-col justify-between rounded-md bg-white p-8 ring-1 ring-line sm:p-12">
              <div>
                <Quote className="h-10 w-10 text-brand-500" strokeWidth={1.4} />
                <div className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Our motto</div>
                <p className="mt-3 font-display text-3xl font-medium leading-snug tracking-tight text-ink-900 sm:text-4xl">
                  Genuine and quality products at reasonable price.
                </p>
                <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-600">
                  Kanyaka Corporation is promoted and guided by {companyInfo.promoter.name}, who brings{" "}
                  {companyInfo.experienceYears} years of experience in the chemical industry, and is managed by a qualified team of
                  highly motivated people.
                </p>
              </div>
              <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
                <div>
                  <div className="font-semibold text-ink-900">{companyInfo.promoter.name}</div>
                  <div className="text-sm text-slate-500">{companyInfo.promoter.designation}</div>
                </div>
                <Link href="/about" className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-700">
                  Our story
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="grain relative h-full overflow-hidden rounded-md bg-ink-900 p-8 text-white sm:p-10">
              <div className="hex-lattice mask-fade-b absolute inset-0" />
              <div className="relative">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">Pashamylaram depot</div>
                <div className="mt-6 font-display text-6xl font-semibold tracking-tight">
                  6,000<span className="text-2xl text-slate-400"> sq.ft</span>
                </div>
                <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-300">
                  Our own warehouse near the Pashamylaram industrial estate, holding godown stock of Grasim and Aditya Birla
                  products.
                </p>
                <ul className="mt-8 space-y-3 text-sm text-slate-300">
                  {companyInfo.warehouse.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-reagent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Flask className="pointer-events-none absolute -bottom-4 -right-6 h-48 w-48 opacity-80" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="px-4 pb-24 sm:px-6 sm:pb-32 lg:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="grain relative isolate overflow-hidden rounded-md bg-gradient-to-br from-brand-700 via-ink-700 to-ink-950 px-6 py-16 text-white sm:px-14 sm:py-20">
            <div className="lab-grid-dark absolute inset-0 -z-10 opacity-60" />
            <MoleculeHero className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[520px] w-[520px] opacity-30" />
            <div className="max-w-2xl">
              <h2 className="text-4xl font-semibold leading-[1.05] sm:text-6xl">Need a rate for your plant?</h2>
              <p className="mt-6 text-lg leading-relaxed text-sky-100/80">
                Tell us the chemical, quantity and delivery location, and we&apos;ll come back with a rate. Or call us on
                {" "}{companyInfo.contacts.phonePrimary} / {companyInfo.contacts.phoneSecondary}.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white py-3.5 pl-6 pr-5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-300"
                >
                  Request a formal quote
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a
                  href={tel}
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3.5 font-mono text-sm text-white transition-colors hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  {companyInfo.contacts.phonePrimary}
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md px-4 py-3.5 text-sm font-medium text-sky-100 underline-offset-4 hover:underline"
                >
                  or message us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
