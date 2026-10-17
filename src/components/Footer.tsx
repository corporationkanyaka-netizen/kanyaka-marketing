"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { companyInfo } from "@/data/company";
import { productsData } from "@/data/products";
import { tileSymbol } from "@/lib/chem";
import { Clock, ExternalLink, Lock, Mail, MapPin, Phone } from "lucide-react";

const sectorLinks = [
  { label: "Pharmaceuticals", href: "/industries#pharma" },
  { label: "Agro & pesticides", href: "/industries#agro" },
  { label: "Textiles", href: "/industries#textiles" },
  { label: "Dairy", href: "/industries#dairy" },
  { label: "Engineering", href: "/industries#engineering" },
];

const companyLinks = [
  { label: "About Kanyaka", href: "/about" },
  { label: "Full catalogue", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Contact & depot", href: "/contact" },
];

export default function Footer() {
  const featured = productsData.slice(0, 6);
  const phones = [companyInfo.contacts.phonePrimary, companyInfo.contacts.phoneSecondary];
  const emails = [companyInfo.contacts.emailDirector, companyInfo.contacts.emailSales];
  const telHref = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;
  const office = companyInfo.addresses.registeredOffice;
  const depot = companyInfo.addresses.warehouseDepot;

  return (
    <footer className="grain relative overflow-hidden bg-ink-950 text-slate-400">
      <div className="lab-grid-dark mask-fade-b absolute inset-0 opacity-50" />

      <div className="relative mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 pb-16 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo size="md" variant="dark-bg" showTagline={true} />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed">
              Authorised dealer of Grasim Industries Ltd. and Aditya Birla Chemicals. Suppliers of chloro-alkali products, acids,
              specialty chemicals and solvents across Telangana &amp; Andhra Pradesh.
            </p>
            <p className="mt-3 max-w-sm text-sm italic text-slate-500">&ldquo;{companyInfo.motto}&rdquo;</p>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="flex flex-col gap-1 font-mono">
                  {phones.map((p) => (
                    <a key={p} href={telHref(p)} className="text-white transition-colors hover:text-brand-300">
                      {p}
                    </a>
                  ))}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span className="flex min-w-0 flex-col gap-1">
                  {emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="break-all text-white transition-colors hover:text-brand-300">
                      {e}
                    </a>
                  ))}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>
                  {office.line1}, {office.line2}, {office.city} – {office.pincode}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                <span>Warehouses: Pashamylaram &amp; Kanukunta, {depot.state}</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-600" />
                <span>{companyInfo.operatingHours}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Key chemicals</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {featured.map((prod) => (
                <li key={prod.id}>
                  <Link href={`/products/${prod.slug}`} className="group flex items-baseline gap-3 transition-colors hover:text-white">
                    <span className="w-14 shrink-0 font-display font-medium text-slate-500 group-hover:text-brand-300">
                      {tileSymbol(prod)}
                    </span>
                    {prod.name.split("(")[0].trim()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Sectors</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {sectorLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Company</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="relative select-none overflow-hidden" aria-hidden="true">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="translate-y-[18%] bg-gradient-to-b from-white/[0.14] to-white/0 bg-clip-text font-display text-[22vw] font-semibold leading-none tracking-[-0.06em] text-transparent lg:text-[15rem]">
            Kanyaka
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>© 2026 Kanyaka Corporation · Authorised dealer of Grasim Industries Ltd. &amp; Aditya Birla Chemicals</div>
          <div className="flex items-center gap-5 sm:pr-20">
            <Link href="/contact" className="transition-colors hover:text-white">
              Terms &amp; SLA
            </Link>
            <a
              href={companyInfo.contacts.webmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <Lock className="h-3 w-3" />
              Staff webmail
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
