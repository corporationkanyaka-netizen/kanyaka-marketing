"use client";

import ProductSelect from "@/components/ProductSelect";
import React, { useState, useEffect, useRef } from "react";
import { productsData } from "@/data/products";
import { companyInfo } from "@/data/company";
import Logo from "@/components/Logo";
import { submitEnquiry, slugForProductName, newIdempotencyKey, type FieldErrors } from "@/lib/enquiry-client";
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  FileCheck,
  ArrowRight,
  Lock,
  Loader2,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
} from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
}

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

export default function QuoteModal({ isOpen, onClose, initialProduct }: QuoteModalProps) {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct || productsData[0].name);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");
  const [needCoa, setNeedCoa] = useState(true);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [enquiryRef, setEnquiryRef] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  // One key per enquiry attempt: reused on retries, cleared once it has gone through.
  const idempotencyKeyRef = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Preselect the requested product whenever it changes (adjusting state during render
  // instead of in an effect, per React guidance).
  const [prevInitialProduct, setPrevInitialProduct] = useState(initialProduct);
  if (initialProduct !== prevInitialProduct) {
    setPrevInitialProduct(initialProduct);
    if (initialProduct) setSelectedProduct(initialProduct);
  }

  // Keep the latest onClose without re-running the open/close effect (parent passes an inline arrow).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape to close, lock page scroll, move focus into the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) onCloseRef.current();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      source: "QUOTE_MODAL",
      name: fullName,
      company: companyName,
      phone,
      email: email.trim() || undefined,
      productSlug: slugForProductName(selectedProduct),
      quantity,
      deliveryLocation: location,
      message: notes.trim() || undefined,
      wantsCoa: needCoa,
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

  const whatsappForwardUrl = `https://wa.me/${companyInfo.contacts.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `*Chemical Enquiry Ref:* ${enquiryRef ?? "NEW"}\n*Company:* ${companyName}\n*Contact:* ${fullName} (${phone})\n*Product:* ${selectedProduct}\n*Quantity:* ${quantity}\n*Location:* ${location}\n*Manufacturer COA requested:* ${needCoa ? 'Yes' : 'No'}\n*Notes:* ${notes}`
  )}`;
  const phones = [companyInfo.contacts.phonePrimary, companyInfo.contacts.phoneSecondary];
  const emails = [companyInfo.contacts.emailDirector, companyInfo.contacts.emailSales];
  const office = companyInfo.addresses.registeredOffice;
  const telHref = (p: string) => `tel:${p.replace(/[^0-9+]/g, "")}`;
  const closeButton = (extra: string) => (
    <button
      type="button"
      onClick={onClose}
      className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-white text-ink-900 shadow-sm ring-1 ring-line transition-colors hover:bg-paper-2 ${extra}`}
      aria-label="Close quote request"
    >
      <X className="h-5 w-5" />
    </button>
  );
  const whatsappChatUrl = `https://wa.me/${companyInfo.contacts.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello Kanyaka Corporation, I would like a quote for ${selectedProduct}.`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        tabIndex={-1}
        className="scroll-thin relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto overscroll-contain rounded-md bg-paper shadow-[0_40px_120px_-30px_rgba(4,11,22,0.7)] ring-1 ring-white/10 outline-none md:flex-row md:overflow-hidden"
      >
        {/* Close — floats over the dark panel on phones; sits in the form header on desktop */}
        {closeButton("absolute right-3 top-3 z-20 md:hidden")}

        {/* Company contact details — the first thing customers see */}
        <aside
          aria-labelledby="quote-contact-title"
          className={`grain scroll-thin-dark relative shrink-0 overflow-hidden bg-ink-900 text-white md:w-[360px] md:overflow-y-auto ${
            isSubmitted ? "hidden md:block" : ""
          }`}
        >
          <div className="hex-lattice mask-fade-b absolute inset-0" />
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-brand-600/20 blur-[80px]" />
          <div className="relative p-6 pr-16 md:p-8">
            <Logo size="md" variant="dark-bg" showTagline={false} />
            <div className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-brand-300">Request a quote</div>
            <h3 id="quote-contact-title" className="mt-2 text-2xl font-semibold leading-tight">
              Talk to our sales desk
            </h3>
            <p className="mt-1.5 text-sm leading-snug text-slate-400">Authorised dealer · Grasim Industries &amp; Aditya Birla Chemicals</p>
          </div>

          <div className="relative px-6 pb-6 md:px-8 md:pb-8">
            <ul className="divide-y divide-white/10 rounded-md bg-white/[0.05] ring-1 ring-white/10">
              <li className="flex gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-500/15 text-brand-300">
                  <Phone className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Call us</div>
                  {phones.map((p) => (
                    <a key={p} href={telHref(p)} className="mt-1 block font-mono text-[15px] text-white transition-colors hover:text-brand-300">
                      {p}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-500/15 text-brand-300">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Email us</div>
                  {emails.map((e) => (
                    <a key={e} href={`mailto:${e}`} className="mt-1 block break-all text-[14px] text-white transition-colors hover:text-brand-300">
                      {e}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex gap-3 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-500/15 text-brand-300">
                  <MapPin className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-400">Office</div>
                  <p className="mt-1 text-[14px] leading-relaxed text-slate-200">
                    {office.line1}, {office.line2}, {office.city} {office.pincode}
                  </p>
                  <p className="mt-1.5 flex items-start gap-1.5 text-[13px] text-slate-400">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {companyInfo.operatingHours}
                  </p>
                </div>
              </li>
            </ul>

            <a
              href={whatsappChatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-4 flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] text-[15px] font-semibold text-white transition-colors hover:bg-[#1fb457]"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </aside>

        {/* Form column — the only part that scrolls on desktop */}
        <div className="flex min-w-0 flex-1 flex-col md:overflow-hidden">
          <div className="hidden shrink-0 items-center justify-between gap-4 border-b border-line px-8 py-3 md:flex">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              {isSubmitted ? "Enquiry received" : "Or leave your details"}
            </span>
            {closeButton("")}
          </div>

          <div className="scroll-thin p-5 sm:p-8 md:flex-1 md:overflow-y-auto">
            {isSubmitted ? (
              <div className="py-4 text-center sm:py-8" role="status" aria-live="polite">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                  <CheckCircle2 className="h-9 w-9" strokeWidth={1.6} />
                </div>
                <h3 id="quote-modal-title" className="mt-6 text-2xl font-semibold text-ink-900 sm:text-3xl">
                  Enquiry ready to send
                </h3>
                {enquiryRef && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-white px-4 py-1.5 font-mono text-sm text-slate-600 ring-1 ring-line">
                    ID <span className="font-semibold text-ink-900">{enquiryRef}</span>
                  </div>
                )}
                <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-slate-600">
                  Thank you, <span className="font-semibold text-ink-900">{fullName}</span> from{" "}
                  <span className="font-semibold text-ink-900">{companyName}</span>. Your enquiry for{" "}
                  <span className="font-semibold text-brand-700">{selectedProduct}</span> is ready. Send it to us on
                  WhatsApp and we will reply with the price and availability.
                </p>

                <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
                  <a
                    href={whatsappForwardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1fb457]"
                  >
                    Send on WhatsApp
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      idempotencyKeyRef.current = null;
                      setEnquiryRef(null);
                      setFormError("");
                      setIsSubmitted(false);
                      onClose();
                    }}
                    className="inline-flex cursor-pointer items-center justify-center rounded-md px-6 py-3.5 text-sm font-medium text-ink-900 ring-1 ring-line transition-colors hover:bg-white"
                  >
                    Close window
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-3 md:hidden">
                    <span className="h-px flex-1 bg-line" />
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Or leave your details</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                  <h3 id="quote-modal-title" className="mt-5 text-2xl font-semibold leading-tight text-ink-900 sm:text-3xl md:mt-0">
                    Get a call back with your quote
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                    Additionally, you can fill in your details below so our team can contact you with the price and availability.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="relative mt-6 space-y-5">
                  {/* Honeypot — hidden from people, tempting to bots. */}
                  <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="quote-website">Website</label>
                    <input
                      id="quote-website"
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
                      <label htmlFor="quote-name" className={labelClass}>
                        Your name<Req />
                      </label>
                      <input
                        id="quote-name"
                        {...errorProps("name", "quote-name")}
                        type="text"
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          clearError("name");
                        }}
                        placeholder="e.g. Ramesh Kumar"
                        className={withError(fieldClass, !!fieldErrors.name)}
                      />
                      <FieldError id="quote-name-error" message={fieldErrors.name} />
                    </div>
                    <div>
                      <label htmlFor="quote-company" className={labelClass}>
                        Company / factory<Req />
                      </label>
                      <input
                        id="quote-company"
                        {...errorProps("company", "quote-company")}
                        type="text"
                        required
                        autoComplete="organization"
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          clearError("company");
                        }}
                        placeholder="e.g. Deccan Pharma Labs Ltd."
                        className={withError(fieldClass, !!fieldErrors.company)}
                      />
                      <FieldError id="quote-company-error" message={fieldErrors.company} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="quote-phone" className={labelClass}>
                        Phone / WhatsApp<Req />
                      </label>
                      <input
                        id="quote-phone"
                        {...errorProps("phone", "quote-phone")}
                        type="tel"
                        required
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearError("phone");
                        }}
                        placeholder="+91 98490 00000"
                        className={`${withError(fieldClass, !!fieldErrors.phone)} font-mono`}
                      />
                      <FieldError id="quote-phone-error" message={fieldErrors.phone} />
                    </div>
                    <div>
                      <label htmlFor="quote-email" className={labelClass}>
                        Official email
                      </label>
                      <input
                        id="quote-email"
                        {...errorProps("email", "quote-email")}
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
                      <FieldError id="quote-email-error" message={fieldErrors.email} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="quote-product" className={labelClass}>
                        Required product<Req />
                      </label>
                      <div className={fieldErrors.productSlug ? "rounded-md ring-2 ring-rose-400" : undefined}>
                        <ProductSelect
                          id="quote-product"
                          value={selectedProduct}
                          onChange={(v) => {
                            setSelectedProduct(v);
                            clearError("productSlug", "message");
                          }}
                          otherValue="Other Chemical"
                        />
                      </div>
                      <FieldError id="quote-product-error" message={fieldErrors.productSlug} />
                    </div>
                    <div>
                      <label htmlFor="quote-quantity" className={labelClass}>
                        Estimated quantity<Req />
                      </label>
                      <input
                        id="quote-quantity"
                        {...errorProps("quantity", "quote-quantity")}
                        type="text"
                        required
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                          clearError("quantity");
                        }}
                        placeholder="e.g. 5 MT / 100 bags"
                        className={withError(fieldClass, !!fieldErrors.quantity)}
                      />
                      <FieldError id="quote-quantity-error" message={fieldErrors.quantity} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="quote-location" className={labelClass}>
                      Delivery destination / industrial area<Req />
                    </label>
                    <input
                      id="quote-location"
                      {...errorProps("deliveryLocation", "quote-location")}
                      type="text"
                      required
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        clearError("deliveryLocation");
                      }}
                      placeholder="e.g. Pashamylaram, Jeedimetla, Vizag"
                      className={withError(fieldClass, !!fieldErrors.deliveryLocation)}
                    />
                    <FieldError id="quote-location-error" message={fieldErrors.deliveryLocation} />
                  </div>

                  <div>
                    <label htmlFor="quote-notes" className={labelClass}>
                      Specifications or notes <span className="font-normal text-slate-500">(optional)</span>
                    </label>
                    <textarea
                      id="quote-notes"
                      {...errorProps("message", "quote-notes")}
                      rows={3}
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        clearError("message");
                      }}
                      placeholder="Packaging preference, delivery timeline, technical grade…"
                      className={`${withError(fieldClass, !!fieldErrors.message)} resize-none`}
                    />
                    <FieldError id="quote-notes-error" message={fieldErrors.message} />
                  </div>

                  <label
                    htmlFor="needCoa"
                    className="flex cursor-pointer items-start gap-3 rounded-md bg-white px-4 py-3.5 ring-1 ring-line transition-colors hover:bg-paper-2"
                  >
                    <input
                      type="checkbox"
                      id="needCoa"
                      checked={needCoa}
                      onChange={(e) => setNeedCoa(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[15px] font-medium leading-snug text-ink-900">
                        <FileCheck className="h-4 w-4 shrink-0 text-brand-600" />
                        Request manufacturer COA
                      </span>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-500">
                        Ask for the manufacturer&apos;s Certificate of Analysis with your quote.
                      </span>
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
                      className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-ink-900 px-6 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending…</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          <span>Submit quote request</span>
                        </>
                      )}
                    </button>
                    <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      Your details are only used to reply to this enquiry.
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
