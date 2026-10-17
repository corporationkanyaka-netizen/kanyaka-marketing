"use client";

import React, { useRef, useState } from "react";
import { companyInfo } from "@/data/company";
import Reveal from "@/components/chem/Reveal";
import ProductSelect from "@/components/ProductSelect";
import LocationMaps from "@/components/LocationMaps";
import Flask from "@/components/chem/Flask";
import { submitEnquiry, slugForProductName, newIdempotencyKey, type FieldErrors } from "@/lib/enquiry-client";
import {
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Warehouse,
  MessageSquare,
  FileCheck,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const fieldClass =
  "w-full rounded-md bg-white px-4 py-3 text-[15px] text-ink-900 placeholder:text-slate-400 ring-1 ring-line outline-none transition-shadow focus:ring-2 focus:ring-brand-500";
const labelClass = "mb-2 block text-sm font-medium text-ink-900";

function Req() {
  return (
    <span className="text-brand-600" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

/** Swap the neutral ring for a rose one when the field is invalid. */
const withError = (cls: string, invalid: boolean) => (invalid ? cls.replace("ring-line", "ring-rose-400") : cls);

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-rose-600">
      {message}
    </p>
  );
}

const telHref = (n: string) => `tel:${n.replace(/[^0-9+]/g, "")}`;

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [product, setProduct] = useState("Caustic Soda Flakes");
  const [quantity, setQuantity] = useState("");
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const [needCoa, setNeedCoa] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enqRef, setEnqRef] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  // One key per enquiry attempt: reused on retries, cleared once it has gone through.
  const idempotencyKeyRef = useRef<string | null>(null);

  const clearError = (...keys: string[]) =>
    setFieldErrors((prev) =>
      keys.some((k) => prev[k]) ? { ...prev, ...Object.fromEntries(keys.map((k) => [k, undefined])) } : prev,
    );

  const errorProps = (key: string, id: string) =>
    fieldErrors[key] ? { "aria-invalid": true as const, "aria-describedby": `${id}-error` } : {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    idempotencyKeyRef.current ??= newIdempotencyKey();
    setIsSubmitting(true);
    setFormError("");

    const result = await submitEnquiry({
      source: "CONTACT_PAGE",
      name: fullName,
      company: companyName,
      phone,
      email: email.trim() || undefined,
      productSlug: slugForProductName(product),
      quantity,
      deliveryLocation: destination,
      message: notes.trim() || undefined,
      wantsCoa: needCoa,
      website,
      idempotencyKey: idempotencyKeyRef.current,
    });

    setIsSubmitting(false);
    if (result.ok) {
      idempotencyKeyRef.current = null;
      setFieldErrors({});
      setEnqRef(result.reference);
      setIsSubmitted(true);
    } else {
      setFieldErrors(result.fieldErrors);
      setFormError(result.message);
    }
  };

  const { contacts } = companyInfo;
  const whatsappNumber = contacts.whatsapp.replace(/[^0-9]/g, "");
  const whatsappDirectUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Kanyaka Corporation, I would like to enquire about chemical supplies.`
  )}`;

  const [hoursMainRaw, hoursNoteRaw] = companyInfo.operatingHours.split(" (");
  const hoursMain = hoursMainRaw.trim();
  const hoursNote = hoursNoteRaw?.replace(/\)$/, "").trim() || "";

  const sites = companyInfo.locations.map((loc) => ({
    icon: loc.kind === "office" ? Building2 : Warehouse,
    tag: loc.place,
    title: loc.title,
    lines: loc.lines,
    href: `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`,
  }));

  return (
    <div>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="grain relative isolate overflow-hidden bg-ink-950 text-white">
        <div className="lab-grid-dark mask-radial absolute inset-0 -z-10" />
        <div className="absolute -left-40 top-0 -z-10 h-[460px] w-[460px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-reagent/10 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-20 lg:pt-20">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">Contact us</div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl">
              Call, email or <span className="text-reagent">visit our office.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Our office is in KPHB Colony, Kukatpally, Hyderabad, with warehouses near the Pashamylaram industrial estate
              (about 6,000 sq.ft.) and at Kanukunta. Call or email us for prices and availability.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-white/10 ring-1 ring-white/10 sm:grid-cols-3">
              <div className="bg-ink-950/80 p-5">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Phone</dt>
                <dd className="mt-2">
                  <a href={telHref(contacts.phonePrimary)} className="font-mono text-lg text-white transition-colors hover:text-brand-300">
                    {contacts.phonePrimary}
                  </a>
                </dd>
              </div>
              <div className="bg-ink-950/80 p-5">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Email</dt>
                <dd className="mt-2 min-w-0">
                  <a
                    href={`mailto:${contacts.emailSales}`}
                    className="block truncate font-mono text-lg text-white transition-colors hover:text-brand-300"
                  >
                    {contacts.emailSales}
                  </a>
                </dd>
              </div>
              <div className="bg-ink-950/80 p-5">
                <dt className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Office open</dt>
                <dd className="mt-2 text-lg text-white">{hoursMain}</dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FORM + DESK ═══════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
          {/* Quote form */}
          <Reveal className="lg:col-span-7">
            <div className="rounded-md bg-white p-6 ring-1 ring-line sm:p-10">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">01 — Request a quotation</div>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.05] text-ink-900 sm:text-4xl">
                Tell us the grade, quantity and plant.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">
                Fill in the form, then send it to us on WhatsApp. We will reply with the price and availability.
              </p>

              <div className="mt-8 border-t border-line pt-8">
                {isSubmitted ? (
                  <div className="rounded-md bg-paper p-6 text-center ring-1 ring-line sm:p-10" role="status" aria-live="polite">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                      <CheckCircle2 className="h-9 w-9" strokeWidth={1.6} />
                    </div>
                    <h3 className="mt-6 text-2xl font-semibold text-ink-900">Enquiry ready to send</h3>
                    {enqRef && (
                      <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-white px-4 py-1.5 font-mono text-sm text-slate-600 ring-1 ring-line">
                        Ref <span className="font-semibold text-ink-900">{enqRef}</span>
                      </div>
                    )}
                    <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-slate-600">
                      Thank you, <strong className="font-semibold text-ink-900">{fullName}</strong> from{" "}
                      <strong className="font-semibold text-ink-900">{companyName}</strong>. We&apos;ve received your
                      requirement for <strong className="font-semibold text-brand-700">{product}</strong> ({quantity}).
                      Please send it to us on WhatsApp, or call {contacts.phonePrimary}.
                    </p>

                    <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          `Hi Kanyaka Corporation, ${enqRef ? `enquiry ${enqRef}` : "new enquiry"}.\n*Name:* ${fullName}\n*Company:* ${companyName}\n*Phone:* ${phone}${email ? `\n*Email:* ${email}` : ""}\n*Product:* ${product}\n*Quantity:* ${quantity}\n*Delivery to:* ${destination}\n*Manufacturer COA requested:* ${needCoa ? "Yes" : "No"}${notes ? `\n*Notes:* ${notes}` : ""}\nPlease share the latest rate.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb457]"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Send on WhatsApp
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          idempotencyKeyRef.current = null;
                          setEnqRef(null);
                          setFormError("");
                          setIsSubmitted(false);
                        }}
                        className="inline-flex cursor-pointer items-center justify-center rounded-md px-6 py-3.5 text-sm font-medium text-ink-900 ring-1 ring-line transition-colors hover:bg-white"
                      >
                        Send another enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
                    {/* Honeypot — hidden from people, tempting to bots. */}
                    <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        name="website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className={labelClass}>
                          Full name<Req />
                        </label>
                        <input
                          id="contact-name"
                          {...errorProps("name", "contact-name")}
                          type="text"
                          required
                          autoComplete="name"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            clearError("name");
                          }}
                          placeholder="e.g. Subba Rao"
                          className={withError(fieldClass, !!fieldErrors.name)}
                        />
                        <FieldError id="contact-name-error" message={fieldErrors.name} />
                      </div>
                      <div>
                        <label htmlFor="contact-company" className={labelClass}>
                          Company / factory<Req />
                        </label>
                        <input
                          id="contact-company"
                          {...errorProps("company", "contact-company")}
                          type="text"
                          required
                          autoComplete="organization"
                          value={companyName}
                          onChange={(e) => {
                            setCompanyName(e.target.value);
                            clearError("company");
                          }}
                          placeholder="e.g. Hyderabad Bulk Drugs Pvt Ltd"
                          className={withError(fieldClass, !!fieldErrors.company)}
                        />
                        <FieldError id="contact-company-error" message={fieldErrors.company} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-phone" className={labelClass}>
                          Phone / mobile<Req />
                        </label>
                        <input
                          id="contact-phone"
                          {...errorProps("phone", "contact-phone")}
                          type="tel"
                          required
                          autoComplete="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            clearError("phone");
                          }}
                          placeholder="+91 98490 12345"
                          className={`${withError(fieldClass, !!fieldErrors.phone)} font-mono`}
                        />
                        <FieldError id="contact-phone-error" message={fieldErrors.phone} />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className={labelClass}>
                          Official email
                        </label>
                        <input
                          id="contact-email"
                          {...errorProps("email", "contact-email")}
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            clearError("email");
                          }}
                          placeholder="purchase@company.com"
                          className={withError(fieldClass, !!fieldErrors.email)}
                        />
                        <FieldError id="contact-email-error" message={fieldErrors.email} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-product" className={labelClass}>
                          Chemical required<Req />
                        </label>
                        <div className={fieldErrors.productSlug ? "rounded-md ring-2 ring-rose-400" : undefined}>
                          <ProductSelect
                            id="contact-product"
                            value={product}
                            onChange={(v) => {
                              setProduct(v);
                              clearError("productSlug", "message");
                            }}
                            otherValue="Other chemical"
                          />
                        </div>
                        <FieldError id="contact-product-error" message={fieldErrors.productSlug} />
                      </div>
                      <div>
                        <label htmlFor="contact-quantity" className={labelClass}>
                          Quantity &amp; packaging<Req />
                        </label>
                        <input
                          id="contact-quantity"
                          {...errorProps("quantity", "contact-quantity")}
                          type="text"
                          required
                          value={quantity}
                          onChange={(e) => {
                            setQuantity(e.target.value);
                            clearError("quantity");
                          }}
                          placeholder="e.g. 10 MT in 50 kg bags"
                          className={withError(fieldClass, !!fieldErrors.quantity)}
                        />
                        <FieldError id="contact-quantity-error" message={fieldErrors.quantity} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-destination" className={labelClass}>
                        Delivery destination / industrial area<Req />
                      </label>
                      <input
                        id="contact-destination"
                          {...errorProps("deliveryLocation", "contact-destination")}
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => {
                            setDestination(e.target.value);
                            clearError("deliveryLocation");
                          }}
                        placeholder="e.g. Pashamylaram, Jeedimetla, Vizag"
                        className={withError(fieldClass, !!fieldErrors.deliveryLocation)}
                      />
                        <FieldError id="contact-destination-error" message={fieldErrors.deliveryLocation} />
                    </div>

                    <div>
                      <label htmlFor="contact-notes" className={labelClass}>
                        Technical or packaging requirements{" "}
                        <span className="font-normal text-slate-500">(optional)</span>
                      </label>
                      <textarea
                        id="contact-notes"
                          {...errorProps("message", "contact-notes")}
                        rows={3}
                        value={notes}
                        onChange={(e) => {
                            setNotes(e.target.value);
                            clearError("message");
                          }}
                        placeholder="Required assay %, packing, preferred delivery date…"
                        className={`${withError(fieldClass, !!fieldErrors.message)} resize-none`}
                      />
                        <FieldError id="contact-notes-error" message={fieldErrors.message} />
                    </div>

                    <label
                      htmlFor="contactCoa"
                      className="flex cursor-pointer items-start gap-3 rounded-md bg-paper px-4 py-3.5 ring-1 ring-line transition-colors hover:bg-paper-2"
                    >
                      <input
                        type="checkbox"
                        id="contactCoa"
                        checked={needCoa}
                        onChange={(e) => setNeedCoa(e.target.checked)}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                      />
                      <span className="text-[15px] leading-snug text-slate-700">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink-900">
                          <FileCheck className="h-4 w-4 text-brand-600" />
                          Request manufacturer COA with the quote
                        </span>{" "}
                        — ask for the manufacturer&apos;s Certificate of Analysis.
                      </span>
                    </label>

                    {formError && (
                      <div role="alert" className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
                        {formError}
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-ink-900 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:px-8"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Sending…</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            <span>Submit enquiry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </Reveal>

          {/* Sales desk + sites */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal delay={120}>
              <div className="grain relative overflow-hidden rounded-md bg-ink-900 p-6 text-white sm:p-10">
                <div className="hex-lattice mask-fade-b absolute inset-0" />
                <Flask className="pointer-events-none absolute -bottom-6 -right-8 h-40 w-40 opacity-40" />
                <div className="relative">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">02 — Direct lines</div>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.05]">Phone &amp; email</h2>

                  <ul className="mt-8 space-y-6">
                    <li className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white/5 text-brand-300 ring-1 ring-white/10">
                        <Phone className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm text-slate-400">Phone &amp; WhatsApp</div>
                        {[contacts.phonePrimary, contacts.phoneSecondary].map((phone) => (
                          <a
                            key={phone}
                            href={telHref(phone)}
                            className="mt-0.5 block font-mono text-xl text-white transition-colors hover:text-brand-300"
                          >
                            {phone}
                          </a>
                        ))}
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white/5 text-brand-300 ring-1 ring-white/10">
                        <Mail className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm text-slate-400">Email</div>
                        {[contacts.emailDirector, contacts.emailSales].map((email) => (
                          <a
                            key={email}
                            href={`mailto:${email}`}
                            className="mt-0.5 block break-all font-mono text-[15px] text-white transition-colors hover:text-brand-300"
                          >
                            {email}
                          </a>
                        ))}
                      </div>
                    </li>

                    <li className="flex gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-white/5 text-brand-300 ring-1 ring-white/10">
                        <Clock className="h-5 w-5" strokeWidth={1.6} />
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm text-slate-400">Business hours</div>
                        <div className="mt-0.5 text-[15px] text-white">{hoursMain}</div>
                        {hoursNote && (
                          <div className="mt-1 flex items-start gap-2 text-sm text-slate-300">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-glow" />
                            {hoursNote}
                          </div>
                        )}
                      </div>
                    </li>
                  </ul>

                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-300 sm:w-auto"
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    Start a WhatsApp chat
                  </a>
                </div>
              </div>
            </Reveal>

            {sites.map((site, i) => (
              <Reveal key={site.title} delay={200 + i * 80}>
                <div className="rounded-md bg-white p-6 ring-1 ring-line sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-ink-900 text-brand-300">
                      <site.icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-right font-mono text-xs uppercase tracking-[0.14em] text-slate-500">{site.tag}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-ink-900">{site.title}</h3>
                  <address className="mt-2 text-[15px] not-italic leading-relaxed text-slate-600">
                    {site.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700"
                  >
                    Get directions
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ LOCATIONS (satellite) ═══════════════ */}
      <section id="locations" className="scroll-mt-32 pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">03 — Our locations</div>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.05] text-ink-900 sm:text-5xl">
              Office and warehouses, from above.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Our office in Kukatpally and warehouses at Pashamylaram and Kanukunta. Pick a location to see it in satellite
              view, zoom out for the surrounding area, or get directions.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <LocationMaps />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
