"use client";

import React from "react";
import Link from "next/link";
import { industriesData } from "@/data/industries";
import { productsData } from "@/data/products";
import { useModals } from "@/components/ClientShell";
import Reveal from "@/components/chem/Reveal";
import MoleculeHero from "@/components/chem/MoleculeHero";
import { categoryTone, tileSymbol } from "@/lib/chem";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bug,
  Check,
  Download,
  FlaskConical,
  MapPin,
  Milk,
  Pill,
  Printer,
  Shield,
  ShieldCheck,
  Shirt,
  Sprout,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const sectorIcons: Record<string, LucideIcon> = {
  Pill,
  Sprout,
  Shirt,
  Shield,
  Printer,
  Milk,
  Wrench,
  Bug,
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function IndustriesPage() {
  const { openQuote, openBrochure } = useModals();

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="grain relative isolate overflow-hidden bg-ink-950 text-white">
        <div className="lab-grid-dark mask-radial absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-brand-600/20 blur-[120px]" />
        <MoleculeHero className="pointer-events-none absolute -right-40 -top-24 -z-10 hidden h-[640px] w-[640px] opacity-25 md:block" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="max-w-3xl">
            <Reveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
                Industries served · {industriesData.length} sectors
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl">
                The right chemicals
                <br />
                <span className="text-reagent">for your industry.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">
                We supply {industriesData.length} industries: {industriesData.map((ind) => ind.name).join(", ")}. See which
                of our chemicals each sector uses.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white py-3.5 pl-6 pr-5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-300"
                >
                  Request a sector quotation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={openBrochure}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Download className="h-4 w-4 text-brand-300" />
                  Sector guide (PDF)
                </button>
              </div>
            </Reveal>
          </div>

          {/* Sector index */}
          <Reveal delay={350} className="mt-16 border-t border-white/10 pt-8">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Jump to a sector</div>
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {industriesData.map((ind, i) => {
                const Icon = sectorIcons[ind.iconName] ?? FlaskConical;
                return (
                  <a
                    key={ind.id}
                    href={`#${ind.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all hover:border-white/25 hover:bg-white/[0.07]"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-brand-300">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-xs text-slate-500">{pad(i + 1)}</span>
                      <span className="block truncate text-sm font-medium text-slate-200 group-hover:text-white">
                        {ind.name}
                      </span>
                    </span>
                    <ArrowDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-y-0.5 group-hover:text-brand-300" />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ SECTORS ═══════════════ */}
      {industriesData.map((industry, index) => {
        const Icon = sectorIcons[industry.iconName] ?? FlaskConical;
        const matchingProducts = productsData.filter((p) => industry.recommendedProductSlugs.includes(p.slug));
        const alt = index % 2 === 1;

        return (
          <section
            key={industry.id}
            id={industry.slug}
            className={`relative scroll-mt-32 border-b border-line py-24 sm:py-32 ${alt ? "bg-paper-2" : "hex-lattice-light"}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Intro */}
                <Reveal className="lg:col-span-5">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink-900 text-brand-300">
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </span>
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">
                      {pad(index + 1)} — Sector
                    </div>
                  </div>
                  <h2 className="mt-6 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">{industry.name}</h2>
                  <p className="mt-4 text-lg font-medium leading-snug text-brand-700">{industry.tagline}</p>
                  <p className="mt-5 text-[15px] leading-relaxed text-slate-600 sm:text-base">{industry.overview}</p>

                  <div className="mt-8">
                    <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      Supplied across
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {industry.industrialClusters.map((cluster) => (
                        <span
                          key={cluster}
                          className="rounded-full bg-white/70 px-3 py-1 text-sm text-slate-600 ring-1 ring-line"
                        >
                          {cluster}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openQuote(matchingProducts[0]?.name || industry.name)}
                    className="group mt-10 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink-900 py-3.5 pl-6 pr-5 text-left text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    Enquire for {industry.name}
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                </Reveal>

                {/* Problem → solution */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
                    <Reveal delay={100} className="h-full">
                      <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
                        <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                          The challenge
                        </div>
                        <ul className="mt-6 space-y-5">
                          {industry.keyChallenges.map((ch, i) => (
                            <li key={ch} className="flex gap-4">
                              <span className="mt-0.5 font-mono text-sm text-amber-600">{pad(i + 1)}</span>
                              <span className="text-[15px] leading-relaxed text-slate-700">{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>

                    <div className="flex items-center justify-center text-brand-500" aria-hidden="true">
                      <ArrowDown className="h-6 w-6 md:hidden" />
                      <ArrowRight className="hidden h-6 w-6 md:block" />
                    </div>

                    <Reveal delay={200} className="h-full">
                      <div className="grain relative h-full overflow-hidden rounded-3xl bg-ink-900 p-6 text-white sm:p-8">
                        <div className="hex-lattice mask-fade-b absolute inset-0" />
                        <div className="relative">
                          <div className="font-mono text-xs uppercase tracking-[0.18em] text-brand-300">
                            The Kanyaka answer
                          </div>
                          <ul className="mt-6 space-y-5">
                            {industry.benefitsWithKanyaka.map((ben) => (
                              <li key={ben} className="flex gap-3">
                                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-reagent/15">
                                  <Check className="h-3.5 w-3.5 text-reagent" />
                                </span>
                                <span className="text-[15px] leading-relaxed text-slate-200">{ben}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>

              {/* Recommended grades */}
              <div className="mt-16">
                <Reveal className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                  <div>
                    <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                      Chemicals we supply for this sector · {matchingProducts.length} products
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                    Genuine products from known manufacturers
                  </div>
                </Reveal>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {matchingProducts.map((prod, i) => {
                    const tone = categoryTone[prod.category];
                    return (
                      <Reveal key={prod.id} delay={(i % 5) * 70} className="h-full">
                        <div
                          className={`group flex h-full flex-col rounded-2xl bg-gradient-to-br ${tone.tile} p-4 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,22,38,0.35)] sm:p-5`}
                        >
                          <Link href={`/products/${prod.slug}`} className="block flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`font-mono text-xs font-semibold ${tone.text}`}>
                                {pad(productsData.indexOf(prod) + 1)}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                                <span className="hidden sm:inline">{tone.label}</span>
                              </span>
                            </div>
                            <div className="mt-5 break-words font-display text-2xl font-semibold leading-none tracking-tight text-ink-900 sm:text-3xl">
                              {tileSymbol(prod)}
                            </div>
                            <div className="mt-3 text-sm font-medium leading-snug text-ink-900 group-hover:text-brand-700">
                              {prod.name}
                            </div>
                            <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{prod.grade}</div>
                            {prod.isGrasimAuthorized && (
                              <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Grasim
                              </div>
                            )}
                          </Link>
                          <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/5 pt-3">
                            <button
                              onClick={() => openQuote(prod.name)}
                              className="cursor-pointer text-sm font-medium text-ink-900 transition-colors hover:text-brand-700"
                            >
                              Get quote
                            </button>
                            <Link
                              href={`/products/${prod.slug}`}
                              aria-label={`Full specifications for ${prod.name}`}
                              className="grid h-8 w-8 place-items-center rounded-full text-ink-900 ring-1 ring-line transition-all hover:bg-ink-900 hover:text-white"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="grain relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-700 via-ink-700 to-ink-950 px-6 py-16 text-white sm:px-14 sm:py-20">
            <div className="lab-grid-dark absolute inset-0 -z-10 opacity-60" />
            <MoleculeHero className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[520px] w-[520px] opacity-30" />
            <div className="max-w-2xl">
              <h2 className="text-4xl font-semibold leading-[1.05] sm:text-5xl">Don&apos;t see your process here?</h2>
              <p className="mt-6 text-lg leading-relaxed text-sky-100/80">
                Tell us which chemicals you use. We&apos;ll confirm availability, packing and price for your requirement.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white py-3.5 pl-6 pr-5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-300"
                >
                  Request a sector quotation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Browse all {productsData.length} chemicals
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
