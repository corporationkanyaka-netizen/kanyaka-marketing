"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Product, productsData } from "@/data/products";
import { companyInfo } from "@/data/company";
import { useModals } from "@/components/ClientShell";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/chem/Reveal";
import BrandKicker from "@/components/BrandKicker";
import HazardPlacard from "@/components/chem/HazardPlacard";
import Flask from "@/components/chem/Flask";
import { categoryTone, hazardClass, physicalState, tileSymbol, unCode } from "@/lib/chem";
import { submitEnquiry, newIdempotencyKey, type FieldErrors } from "@/lib/enquiry-client";
import {
  ShieldCheck,
  Package,
  Clock,
  Send,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Download,
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Scale,
  Loader2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

const inputClass =
  "w-full rounded-md border border-white/15 bg-white/5 px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-slate-500 focus:border-brand-400 focus:bg-white/10 focus:ring-2 focus:ring-brand-400/40";
const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

/** Rose border + ring for an invalid field. */
const withError = (cls: string, invalid: boolean) =>
  invalid ? `${cls.replace("border-white/15", "border-rose-400")} ring-1 ring-rose-400` : cls;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-rose-300">
      {message}
    </p>
  );
}

// Divider rules for the 1 → 2 → 4 column identity strip.
const identityBorders = [
  "",
  "border-t sm:border-l sm:border-t-0 sm:pl-6",
  "border-t lg:border-l lg:border-t-0 lg:pl-6",
  "border-t sm:border-l sm:pl-6 lg:border-t-0",
];

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { openQuote, openBrochure } = useModals();

  // Inline RFQ state
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  // One key per enquiry attempt: reused on retries, cleared once it has gone through.
  const idempotencyKeyRef = useRef<string | null>(null);

  const clearError = (key: string) =>
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const errorProps = (key: string, id: string) =>
    fieldErrors[key] ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    idempotencyKeyRef.current ??= newIdempotencyKey();
    setIsSubmitting(true);
    setFormError("");

    const result = await submitEnquiry({
      source: "PRODUCT_PAGE",
      name,
      company,
      phone,
      productSlug: product.slug,
      quantity,
      deliveryLocation: location,
      message: undefined,
      wantsCoa: false,
      website,
      idempotencyKey: idempotencyKeyRef.current,
    });

    setIsSubmitting(false);
    if (result.ok) {
      idempotencyKeyRef.current = null;
      setFieldErrors({});
      setEnquiryRef(result.reference);
      setIsSubmitted(true);
    } else {
      setFieldErrors(result.fieldErrors);
      setFormError(result.message);
    }
  };

  const whatsappBase = `https://wa.me/${companyInfo.contacts.whatsapp.replace(/[^0-9]/g, "")}?text=`;
  const whatsappInquiryUrl = `${whatsappBase}${encodeURIComponent(
    `Hello Kanyaka Corporation, I would like to enquire about availability and price for *${product.name}* (${product.grade}).`
  )}`;

  // Props cross the server/client boundary as copies, so match by slug rather than reference.
  const indexOfSlug = (slug: string) => productsData.findIndex((p) => p.slug === slug);
  const periodicNumber = String(indexOfSlug(product.slug) + 1).padStart(2, "0");

  const tone = categoryTone[product.category];
  const hazard = hazardClass(product);
  const un = unCode(product);
  const symbol = tileSymbol(product);
  const state = physicalState(product);

  const identity = [
    { label: "Formula", value: product.chemicalFormula, mono: true },
    { label: "CAS number", value: product.casNumber, mono: true },
    { label: "Assay / purity", value: product.purity, mono: true },
    { label: "UN / hazmat", value: product.unNumber, mono: true },
  ];

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="grain relative isolate overflow-hidden bg-ink-950 text-white">
        <div className="lab-grid-dark mask-radial absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-10 -z-10 h-[480px] w-[480px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 -z-10 h-[380px] w-[380px] rounded-full bg-reagent/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="no-scrollbar flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-slate-400"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <Link href="/products" className="transition-colors hover:text-white">
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-600" />
            <span className="truncate font-medium text-slate-200">{product.name}</span>
          </nav>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-10">
            {/* Title block */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="flex flex-wrap items-center gap-2">
                  {product.isGrasimAuthorized ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-glow/30 bg-amber-glow/10 px-3 py-1 text-sm font-medium text-amber-glow">
                      <ShieldCheck className="h-4 w-4" />
                      Authorised dealer · {product.manufacturer}
                    </span>
                  ) : (
                    product.manufacturer !== "Godown stock" && (
                      <span className="inline-flex items-center rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-200">
                        Make: {product.manufacturer}
                      </span>
                    )
                  )}
                  {product.fromGodown && (
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300">
                      <Package className="h-4 w-4" />
                      Godown stock
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-300">
                    <span className={`h-2 w-2 rounded-full ${tone.dot}`} />
                    {product.category}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-6">
                  <BrandKicker label={`Element ${periodicNumber} · CAS ${product.casNumber}`} />
                </div>
                <h1 className="mt-6 break-words text-5xl font-medium leading-[1.0] tracking-[-0.04em] sm:text-6xl">
                  {product.name}
                </h1>
                <p className="mt-5 text-lg font-medium text-reagent sm:text-xl">{product.grade}</p>
                {product.synonyms.length > 0 && (
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
                    Also known as {product.synonyms.join(" · ")}
                  </p>
                )}
              </Reveal>

              <Reveal delay={200}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => openQuote(product.name)}
                    className="group inline-flex cursor-pointer items-center gap-2 rounded-md bg-white py-3.5 pl-6 pr-5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-300"
                  >
                    Request a quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-400" />
                    WhatsApp enquiry
                  </a>
                  <button
                    onClick={openBrochure}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-3.5 text-sm font-medium text-slate-300 transition-colors hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    Brochure
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Periodic element tile */}
            <Reveal delay={150} className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md bg-brand-500/15" />
                <div
                  className={`relative overflow-hidden rounded-md bg-gradient-to-br ${tone.tile} p-5 text-ink-900 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:p-6`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="font-mono leading-tight">
                      <div className={`text-2xl font-medium ${tone.text}`}>{periodicNumber}</div>
                      <div className="mt-1 text-sm text-slate-500">CAS {product.casNumber}</div>
                    </div>
                    {hazard ? (
                      <HazardPlacard hazard={hazard} size={64} />
                    ) : (
                      <span className="rounded-md bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        Non-hazardous
                      </span>
                    )}
                  </div>

                  <div
                    className={`my-10 font-display font-medium leading-none tracking-tight sm:my-12 ${
                      symbol.length > 5 ? "text-[clamp(3rem,13vw,4.75rem)]" : "text-[clamp(3.75rem,19vw,6.5rem)]"
                    }`}
                  >
                    {symbol}
                  </div>

                  <div className="text-lg font-medium leading-snug">{product.name}</div>
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-black/10 pt-5">
                    <div>
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">Assay</div>
                      <div className="mt-1 font-mono text-[15px] font-medium leading-snug">{product.purity}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">State · UN</div>
                      <div className="mt-1 font-mono text-[15px] font-medium">
                        {state}
                        {un ? ` · ${un}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Identity strip */}
        <div className="border-t border-white/10">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {identity.map((item, i) => (
              <div
                key={item.label}
                className={`min-w-0 border-white/10 py-6 sm:py-8 ${identityBorders[i]}`}
              >
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</dt>
                <dd className="mt-2 break-words font-mono text-lg font-medium text-white">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ═══════════════ OVERVIEW + SPEC SHEET + RFQ ═══════════════ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
          <div className="min-w-0 lg:col-span-7">
            <Reveal>
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">01 — Product overview</div>
              <h2 className="mt-4 text-4xl font-medium leading-[1.05] text-ink-900 sm:text-5xl">
                About this product.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">{product.detailedDescription}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
                <span className="font-medium text-ink-900">Appearance:</span> {product.physicalAppearance}
              </p>
            </Reveal>

            {/* Lab report spec sheet */}
            <Reveal delay={100} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-md bg-ink-900/5" />
                <div className="lab-grid-light relative overflow-hidden rounded-md bg-white p-5 shadow-[0_40px_80px_-40px_rgba(11,22,38,0.45)] ring-1 ring-line sm:p-8">
                  <div className="flex items-start justify-between gap-4 border-b-2 border-ink-900 pb-5">
                    <div className="min-w-0">
                      <div className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
                        Typical specification
                      </div>
                      <h3 className="mt-2 text-2xl font-medium text-ink-900 sm:text-3xl">{product.name}</h3>
                      <div className="mt-1 text-sm text-slate-500">
                        {product.manufacturer === "Godown stock" ? "From our godown stock" : `Make: ${product.manufacturer}`}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-display text-3xl font-medium text-brand-700 sm:text-4xl">{symbol}</div>
                      <div className="mt-1 font-mono text-xs text-slate-500">CAS {product.casNumber}</div>
                    </div>
                  </div>

                  <table className="mt-2 w-full text-[15px]">
                    <thead>
                      <tr className="text-left font-mono text-xs uppercase tracking-wider text-slate-400">
                        <th className="py-3 font-normal">Parameter</th>
                        <th className="py-3 text-right font-normal">Specification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.keySpecs.map((spec, i) => (
                        <tr key={i} className="border-t border-dashed border-line align-top">
                          <td className="py-3.5 pr-4 text-slate-700">{spec.parameter}</td>
                          <td className="py-3.5 text-right font-mono font-medium text-ink-900">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-6 flex flex-col gap-5 border-t-2 border-ink-900 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      {hazard && <HazardPlacard hazard={hazard} size={44} />}
                      <div className="text-sm leading-relaxed text-slate-500">
                        <div className="font-mono text-ink-900">{product.unNumber}</div>
                        <div>Typical specification — the manufacturer&apos;s batch COA is final</div>
                      </div>
                    </div>
                    <button
                      onClick={openBrochure}
                      className="group inline-flex shrink-0 cursor-pointer items-center gap-1.5 self-start text-sm font-medium text-brand-700 sm:self-auto"
                    >
                      <Download className="h-4 w-4" />
                      View product list
                    </button>
                  </div>

                  <div className="pointer-events-none absolute right-6 top-28 hidden rotate-[-12deg] rounded-md border-2 border-emerald-600/60 px-3 py-1.5 text-center font-mono text-xs font-medium uppercase leading-tight tracking-wider text-emerald-700/80 sm:block">
                    Typical
                    <br />
                    spec
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sticky RFQ panel */}
          <aside className="lg:col-span-5">
            <div className="space-y-5 lg:sticky lg:top-28">
              <Reveal delay={150}>
                <div className="grain relative isolate overflow-hidden rounded-md bg-ink-900 p-5 text-white sm:p-6">
                  <div className="hex-lattice mask-fade-b absolute inset-0 -z-10" />
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
                    {product.fromGodown ? "Godown stock · near Pashamylaram" : "Supplied against order"}
                  </div>
                  <h3 className="mt-3 text-2xl font-medium sm:text-3xl">Request a rate</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                    Ask for the current price and availability of {product.name}.
                  </p>

                  {isSubmitted ? (
                    <div className="mt-6 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                      <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" strokeWidth={1.6} />
                      <h4 className="mt-3 text-lg font-medium text-white">Thank you, {name}</h4>
                      {enquiryRef && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-1.5 font-mono text-sm text-slate-300 ring-1 ring-white/15">
                          Ref <span className="font-medium text-white">{enquiryRef}</span>
                        </div>
                      )}
                      <p className="mt-2 text-[15px] leading-relaxed text-slate-300">
                        Your enquiry has been emailed to our sales team. We&apos;ll contact you shortly with the price and
                        availability.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleInlineSubmit} noValidate className="relative mt-6 space-y-4">
                      {/* Honeypot — hidden from people, tempting to bots. */}
                      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="rfq-website">Website</label>
                        <input
                          id="rfq-website"
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="rfq-name" className={labelClass}>
                          Your name *
                        </label>
                        <input
                          id="rfq-name"
                          {...errorProps("name", "rfq-name")}
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            clearError("name");
                          }}
                          placeholder="e.g. Purchase Manager"
                          className={withError(inputClass, !!fieldErrors.name)}
                        />
                        <FieldError id="rfq-name-error" message={fieldErrors.name} />
                      </div>

                      <div>
                        <label htmlFor="rfq-company" className={labelClass}>
                          Company name *
                        </label>
                        <input
                          id="rfq-company"
                          {...errorProps("company", "rfq-company")}
                          type="text"
                          required
                          value={company}
                          onChange={(e) => {
                            setCompany(e.target.value);
                            clearError("company");
                          }}
                          placeholder="e.g. Telangana Pharma Labs"
                          className={withError(inputClass, !!fieldErrors.company)}
                        />
                        <FieldError id="rfq-company-error" message={fieldErrors.company} />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="rfq-phone" className={labelClass}>
                            Phone / WhatsApp *
                          </label>
                          <input
                            id="rfq-phone"
                            {...errorProps("phone", "rfq-phone")}
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              clearError("phone");
                            }}
                            placeholder="+91..."
                            className={withError(inputClass, !!fieldErrors.phone)}
                          />
                          <FieldError id="rfq-phone-error" message={fieldErrors.phone} />
                        </div>
                        <div>
                          <label htmlFor="rfq-quantity" className={labelClass}>
                            Required quantity *
                          </label>
                          <input
                            id="rfq-quantity"
                            {...errorProps("quantity", "rfq-quantity")}
                            type="text"
                            required
                            value={quantity}
                            onChange={(e) => {
                              setQuantity(e.target.value);
                              clearError("quantity");
                            }}
                            placeholder="e.g. 5 MT / 100 bags"
                            className={withError(inputClass, !!fieldErrors.quantity)}
                          />
                          <FieldError id="rfq-quantity-error" message={fieldErrors.quantity} />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="rfq-location" className={labelClass}>
                          Delivery destination *
                        </label>
                        <input
                          id="rfq-location"
                          {...errorProps("deliveryLocation", "rfq-location")}
                          type="text"
                          required
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            clearError("deliveryLocation");
                          }}
                          placeholder="e.g. Pashamylaram, Jeedimetla, Vizag"
                          className={withError(inputClass, !!fieldErrors.deliveryLocation)}
                        />
                        <FieldError id="rfq-location-error" message={fieldErrors.deliveryLocation} />
                      </div>

                      {formError && (
                        <div role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                          {formError}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-300 disabled:cursor-wait disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Sending…</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span className="truncate">Request rate for {product.name}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  <div className="mt-6 border-t border-white/10 pt-6">
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-400" />
                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="flex gap-4 rounded-md bg-white p-5 ring-1 ring-line">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                    <FileCheck className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="font-medium text-ink-900">Manufacturer COA on request</div>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                      Specs on this page are typical values. Ask for the manufacturer&apos;s batch Certificate of Analysis
                      when you enquire.
                    </p>
                    <button
                      onClick={openBrochure}
                      className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      View product list
                    </button>
                  </div>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      {/* ═══════════════ APPLICATIONS ═══════════════ */}
      <section className="hex-lattice-light bg-paper-2 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">02 — Applications</div>
            <h2 className="mt-4 text-4xl font-medium leading-[1.05] text-ink-900 sm:text-5xl">
              Where {symbol} goes to work.
            </h2>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {product.applications.map((app, i) => (
              <Reveal key={i} delay={(i % 3) * 80}>
                <div className="group flex h-full flex-col rounded-md bg-white p-6 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,22,38,0.35)] sm:p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                  </div>
                  <h3 className="mt-8 text-xl font-medium leading-snug text-ink-900">{app.industry}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{app.application}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HANDLING + PACKAGING ═══════════════ */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <Reveal className="lg:col-span-7">
            <div className="h-full rounded-md bg-white p-6 ring-1 ring-line sm:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">03 — Safety</div>
                  <h2 className="mt-4 text-3xl font-medium leading-[1.1] text-ink-900 sm:text-4xl">
                    Handling, storage &amp; safety.
                  </h2>
                </div>
                {hazard ? (
                  <HazardPlacard hazard={hazard} size={72} />
                ) : (
                  <AlertTriangle className="h-10 w-10 shrink-0 text-amber-500" strokeWidth={1.5} />
                )}
              </div>
              <div className="mt-3 font-mono text-sm text-slate-500">{product.unNumber}</div>

              <ul className="mt-8 divide-y divide-dashed divide-line border-t-2 border-ink-900">
                {product.handlingStorage.map((guide, i) => (
                  <li key={i} className="flex items-start gap-4 py-4 text-[15px] leading-relaxed text-slate-700">
                    <span className="mt-0.5 font-mono text-sm text-amber-600">{String(i + 1).padStart(2, "0")}</span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5">
            <div className="grain relative isolate h-full overflow-hidden rounded-md bg-ink-900 p-6 text-white sm:p-8">
              <div className="hex-lattice mask-fade-b absolute inset-0 -z-10" />
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">04 — Supply terms</div>
              <h2 className="mt-4 text-3xl font-medium leading-[1.1] sm:text-4xl">Packaging &amp; supply.</h2>

              <div className="mt-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Package className="h-4 w-4 text-brand-300" />
                    Available packaging
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {product.packagingOptions.map((opt, i) => (
                      <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-slate-200">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-reagent" />
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Clock className="h-4 w-4 text-amber-glow" />
                    Supply
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-200">{product.deliveryLeadTime}</p>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Scale className="h-4 w-4 text-brand-300" />
                    Minimum order
                  </div>
                  <p className="mt-2 font-mono text-lg text-white">{product.minOrderQuantity}</p>
                </div>
              </div>

              <Flask className="pointer-events-none absolute -bottom-6 -right-8 -z-10 h-44 w-44 opacity-40" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ RELATED ═══════════════ */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-line pb-12 pt-14 sm:pb-16 sm:pt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">
                  Same group · {tone.label}
                </div>
                <h2 className="mt-4 text-4xl font-medium leading-[1.05] text-ink-900 sm:text-5xl">
                  Related chemicals in {product.category}.
                </h2>
              </div>
              <Link
                href="/products"
                className="group inline-flex shrink-0 items-center gap-2 self-start rounded-md px-5 py-3 text-sm font-medium text-ink-900 ring-1 ring-line transition-colors hover:bg-white sm:self-auto"
              >
                View all chemicals
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel, i) => (
                <Reveal key={rel.id} delay={i * 80} className="h-full">
                  <ProductCard product={rel} index={indexOfSlug(rel.slug)} onOpenQuote={openQuote} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
