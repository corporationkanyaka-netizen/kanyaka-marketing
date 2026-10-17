"use client";

import React from "react";
import Link from "next/link";
import { companyInfo } from "@/data/company";
import { industriesData } from "@/data/industries";
import { productsData } from "@/data/products";
import { useModals } from "@/components/ClientShell";
import Reveal from "@/components/chem/Reveal";
import Flask from "@/components/chem/Flask";
import MoleculeHero from "@/components/chem/MoleculeHero";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Download,
  Factory,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  Quote,
  ShieldCheck,
  Users,
  Warehouse,
} from "lucide-react";

// "What we supply": products grouped by manufacturer / source, straight from productsData.
const supplyGroups = productsData.reduce<{ source: string; products: string[] }[]>((groups, p) => {
  const existing = groups.find((g) => g.source === p.manufacturer);
  if (existing) existing.products.push(p.name);
  else groups.push({ source: p.manufacturer, products: [p.name] });
  return groups;
}, []);

const supplyRegions = industriesData[0]?.industrialClusters ?? [];

const depotFacts = [
  {
    icon: Warehouse,
    value: "6,000",
    unit: "sq.ft",
    title: "Warehouse space",
    body: "Our own warehouse near the Pashamylaram industrial estate.",
  },
  {
    icon: BadgeCheck,
    value: "2",
    unit: "principals",
    title: "Authorised stock",
    body: "Grasim Industries and Aditya Birla Chemicals products held in stock.",
  },
  {
    icon: MapPin,
    value: String(supplyRegions.length),
    unit: "states",
    title: "Supply area",
    body: `Supplying industries across ${supplyRegions.join(" and ")}.`,
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Genuine products",
    body: "Authorised dealer for Grasim Industries and Aditya Birla Chemicals. Material comes from the manufacturer, not the open market.",
  },
  {
    icon: Factory,
    title: "Quality sources",
    body: "Products from known manufacturers: Grasim, Aditya Birla Chemicals, Tata Chemicals, Andhra Sugars, RCF and Kutch Chemicals.",
  },
  {
    icon: IndianRupee,
    title: "Reasonable price",
    body: "Fair pricing is part of our motto: genuine and quality products at a reasonable price.",
  },
  {
    icon: Users,
    title: "Experienced team",
    body: `Guided by a promoter with ${companyInfo.experienceYears} years in chemicals, and managed by a qualified, highly motivated team.`,
  },
];

const statBorders = ["", "border-l pl-6", "border-t lg:border-l lg:border-t-0 lg:pl-6", "border-l border-t pl-6 lg:border-t-0"];

export default function AboutUsPage() {
  const { openQuote, openBrochure } = useModals();

  const stats = [companyInfo.stats[0], companyInfo.stats[2], companyInfo.stats[1], companyInfo.stats[4]];
  const tel = `tel:${companyInfo.contacts.phonePrimary.replace(/[^0-9+]/g, "")}`;

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="grain relative isolate overflow-hidden bg-ink-950 text-white">
        <div className="lab-grid-dark mask-radial absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-brand-600/20 blur-[120px]" />
        <MoleculeHero className="pointer-events-none absolute -right-40 -top-24 -z-10 hidden h-[620px] w-[620px] opacity-25 md:block" />

        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-14">
          <div className="max-w-3xl">
            <Reveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
                About Kanyaka Corporation · Authorised Grasim dealer
              </div>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl">
                Genuine chemicals.
                <br />
                <span className="text-reagent">Reasonable prices.</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300">
                We supply chloro-alkali products, acids, specialty chemicals and solvents to manufacturing industry. We
                are an authorised dealer for Grasim Industries Ltd. and Aditya Birla Chemicals.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openQuote()}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white py-3.5 pl-6 pr-5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-300"
                >
                  Connect with our sales team
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button
                  onClick={openBrochure}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  <Download className="h-4 w-4 text-brand-300" />
                  Line card (PDF)
                </button>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className={`border-white/10 py-8 lg:py-10 ${statBorders[i]}`}>
                <div className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-400">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FOUNDER ═══════════════ */}
      <section className="hex-lattice-light py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-4xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">01 — The promoter</div>
            <Quote className="mt-8 h-10 w-10 text-brand-500" strokeWidth={1.4} />
            <blockquote className="mt-6 font-display text-3xl font-medium leading-[1.2] tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
              Our motto is simple —
              <span className="text-brand-700"> genuine and quality products at reasonable price.</span>
            </blockquote>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <Reveal delay={100} className="lg:col-span-5">
              <div className="grain relative h-full overflow-hidden rounded-md bg-ink-900 p-8 text-white sm:p-10">
                <div className="hex-lattice mask-fade-b absolute inset-0" />
                <div className="relative">
                  <div className="grid h-20 w-20 place-items-center rounded-md bg-white/5 font-display text-3xl font-semibold text-brand-300 ring-1 ring-white/15">
                    KS
                  </div>
                  <h2 className="mt-8 text-3xl font-semibold">{companyInfo.promoter.name}</h2>
                  <div className="mt-1 text-brand-300">{companyInfo.promoter.designation}</div>
                  <div className="mt-2 font-mono text-sm text-slate-400">{companyInfo.promoter.experience}</div>

                  <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                    <div>
                      <div className="font-display text-4xl font-semibold tracking-tight">{companyInfo.experienceYears}</div>
                      <div className="mt-1 text-sm text-slate-400">Years in chemicals</div>
                    </div>
                    <div>
                      <div className="font-display text-4xl font-semibold tracking-tight">{productsData.length}</div>
                      <div className="mt-1 text-sm text-slate-400">Chemicals supplied</div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={200} className="lg:col-span-7">
              <div className="flex h-full flex-col rounded-md bg-white p-8 ring-1 ring-line sm:p-10">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">Promoter profile</div>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-ink-900 sm:text-3xl">
                  Promoted and guided by {companyInfo.promoter.name}.
                </h3>
                <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">{companyInfo.promoter.bio}</p>
                <ul className="mt-6 space-y-3 text-base text-slate-600">
                  {[
                    `${companyInfo.promoter.designation}: ${companyInfo.promoter.name}`,
                    `Experience: ${companyInfo.promoter.experience}`,
                    "Team: a qualified team of highly motivated personnel",
                  ].map((line) => (
                    <li key={line} className="flex gap-3">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                      {line}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                  <a
                    href={tel}
                    className="inline-flex items-center gap-2 rounded-md bg-ink-900 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="font-mono">Call {companyInfo.contacts.phonePrimary}</span>
                  </a>
                  <a
                    href={`mailto:${companyInfo.contacts.emailDirector}`}
                    className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium text-ink-900 ring-1 ring-line transition-colors hover:bg-paper"
                  >
                    <Mail className="h-4 w-4 text-brand-600" />
                    Email the promoter
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRINCIPALS ═══════════════ */}
      <section className="bg-paper-2 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">02 — Our principals</div>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">
              Authorised dealer for Grasim and Aditya Birla Chemicals.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {companyInfo.authorizedPartners.map((partner, i) => (
              <Reveal key={partner.name} delay={i * 100} className="h-full">
                <div className="flex h-full flex-col rounded-md bg-white p-8 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,22,38,0.35)]">
                  <div className="flex items-center justify-between gap-4">
                    <BadgeCheck className={`h-7 w-7 ${i === 0 ? "text-amber-500" : "text-brand-500"}`} strokeWidth={1.6} />
                    <span className="font-mono text-xs text-slate-400">{partner.parent}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold leading-tight text-ink-900">{partner.name}</h3>
                  <div className="mt-1 text-sm font-medium text-brand-700">{partner.tier}</div>
                  <p className="mt-5 flex-1 text-[15px] leading-relaxed text-slate-600">{partner.products}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DEPOT ═══════════════ */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grain relative overflow-hidden rounded-md bg-ink-900 px-6 py-12 text-white sm:px-12 sm:py-12">
              <div className="hex-lattice mask-fade-b absolute inset-0" />
              <Flask className="pointer-events-none absolute -bottom-6 -right-8 hidden h-64 w-64 opacity-70 lg:block" />

              <div className="relative">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
                  <div className="lg:col-span-7">
                    <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">03 — Our warehouse</div>
                    <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">
                      Stock held at Pashamylaram & Kanukunta.
                    </h2>
                    <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                      {companyInfo.warehouse.location}.
                    </p>
                  </div>
                  <div className="lg:col-span-5">
                    <div className="font-display text-6xl font-semibold tracking-tight sm:text-8xl">
                      6,000<span className="text-2xl text-slate-400"> sq.ft</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-400">Around {companyInfo.warehouse.area}</div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-white/10 ring-1 ring-white/10 md:grid-cols-3">
                  {depotFacts.map((fact) => (
                    <div key={fact.title} className="bg-ink-900 p-6 sm:p-8">
                      <fact.icon className="h-6 w-6 text-brand-300" strokeWidth={1.6} />
                      <div className="mt-6 font-display text-4xl font-semibold tracking-tight">
                        {fact.value}
                        <span className="ml-1.5 font-mono text-base font-normal text-slate-400">{fact.unit}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold">{fact.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{fact.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-3 text-sm text-slate-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
                    <span>
                      Warehouses:{" "}
                      <strong className="font-medium text-white">
                        {companyInfo.addresses.warehouseDepot.line1} · Kanukunta, Telangana
                      </strong>
                    </span>
                  </div>
                  <Link
                    href="/contact#locations"
                    className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-white"
                  >
                    See them in satellite view
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ WHAT WE SUPPLY ═══════════════ */}
      <section className="bg-paper-2 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          <Reveal className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">04 — What we supply</div>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">
                {productsData.length} chemicals from known manufacturers.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Industries we serve: {companyInfo.industriesServed.join(", ")}.
              </p>
            </div>
          </Reveal>

          <ol className="relative lg:col-span-8">
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden="true" />
            {supplyGroups.map((g, i) => (
              <Reveal as="li" key={g.source} delay={i * 80} className="relative pb-12 pl-10 last:pb-0">
                <span
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-2 border-brand-500 bg-paper-2"
                  aria-hidden="true"
                />
                <div className="font-mono text-sm font-medium text-brand-700">
                  {g.products.length} {g.products.length === 1 ? "product" : "products"}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-ink-900">{g.source}</h3>
                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
                  {g.products.join(" · ")}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══════════════ VALUES ═══════════════ */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">05 — What we stand for</div>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">
              Genuine. Quality. Reasonable price.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-line ring-1 ring-line md:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80} className="group bg-paper p-8 transition-colors hover:bg-white">
                <span className="font-mono text-sm text-slate-400">0{i + 1}</span>
                <div className="mt-8 grid h-14 w-14 place-items-center rounded-md bg-ink-900 text-brand-300 transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-105">
                  <v.icon className="h-6 w-6" strokeWidth={1.6} />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink-900">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{v.body}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => openQuote()}
              className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-ink-900 py-3.5 pl-6 pr-5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              Work with Kanyaka
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/industries"
              className="inline-flex items-center gap-2 rounded-md px-6 py-3.5 text-sm font-medium text-ink-900 ring-1 ring-line transition-colors hover:bg-white"
            >
              Industries we serve
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
