"use client";

import ProductSelect from "@/components/ProductSelect";
import React, { useState, useEffect, useRef } from "react";
import { productsData } from "@/data/products";
import { companyInfo } from "@/data/company";
import Flask from "@/components/chem/Flask";
import { submitEnquiry, slugForProductName, newIdempotencyKey, type FieldErrors } from "@/lib/enquiry-client";
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  ShieldCheck,
  FileCheck,
  ArrowRight,
  Warehouse,
  Lock,
  Loader2,
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

const assurances = [
  { icon: ShieldCheck, title: "Authorised dealer", body: "Grasim Industries Ltd. and Aditya Birla Chemicals." },
  { icon: Warehouse, title: "Own warehouse", body: "About 6,000 sq.ft. near Pashamylaram industrial estate." },
  { icon: FileCheck, title: "Manufacturer COA", body: "Available on request with your quote." },
];

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
  const tel = `tel:${companyInfo.contacts.phonePrimary.replace(/[^0-9+]/g, "")}`;

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
        className="relative flex max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-md bg-paper shadow-[0_40px_120px_-30px_rgba(4,11,22,0.7)] ring-1 ring-white/10 outline-none animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/90 text-ink-900 ring-1 ring-line transition-colors hover:bg-white"
          aria-label="Close quote request"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Dark info strip (md+) */}
        <aside className="grain relative hidden w-72 shrink-0 flex-col overflow-hidden bg-ink-900 p-8 text-white md:flex">
          <div className="hex-lattice mask-fade-b absolute inset-0" />
          <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-brand-600/20 blur-[80px]" />
          <div className="relative">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">Request a quote</div>
            <p className="mt-4 font-display text-2xl font-semibold leading-tight">
              Genuine and quality products <span className="text-reagent">at reasonable price.</span>
            </p>
            <ul className="mt-8 space-y-5">
              {assurances.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <a.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" strokeWidth={1.6} />
                  <div>
                    <div className="text-sm font-medium text-white">{a.title}</div>
                    <div className="mt-0.5 text-sm leading-snug text-slate-400">{a.body}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mt-auto pt-10">
            <div className="text-sm text-slate-400">Prefer to call?</div>
            <a href={tel} className="mt-1 inline-flex items-center gap-2 font-mono text-[15px] text-white transition-colors hover:text-brand-300">
              <Phone className="h-4 w-4 text-brand-300" />
              {companyInfo.contacts.phonePrimary}
            </a>
          </div>
          <Flask className="pointer-events-none absolute -bottom-6 -right-10 h-40 w-40 opacity-50" />
        </aside>

        {/* Form column */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          {/* Slim dark band (mobile) */}
          <div className="grain relative overflow-hidden bg-ink-900 px-5 pb-6 pt-6 pr-16 text-white md:hidden">
            <div className="hex-lattice mask-fade-b absolute inset-0" />
            <div className="relative font-mono text-xs uppercase tracking-[0.2em] text-brand-300">Request a quote</div>
            <p className="relative mt-2 text-sm text-slate-300">Authorised Grasim &amp; Aditya Birla Chemicals dealer</p>
          </div>

          <div className="p-5 sm:p-8 md:p-10">
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
                <div className="pr-10 md:pr-12">
                  <div className="hidden font-mono text-xs uppercase tracking-[0.2em] text-brand-700 md:block">
                    Request a quote
                  </div>
                  <h3 id="quote-modal-title" className="text-3xl font-semibold leading-[1.05] text-ink-900 md:mt-3">
                    Chemical quote
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                    Tell us the product, quantity and delivery location. We will reply with the price and availability.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="relative mt-8 space-y-5">
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
