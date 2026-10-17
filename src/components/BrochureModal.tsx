"use client";

import React, { useEffect, useRef } from "react";
import { productsData } from "@/data/products";
import { companyInfo } from "@/data/company";
import { tileSymbol } from "@/lib/chem";
import { X, Printer, ShieldCheck, Warehouse, Phone, Mail, FileText, MapPin } from "lucide-react";

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const godownCount = productsData.filter((p) => p.fromGodown).length;

const pillars = [
  { value: "Grasim & Aditya Birla", label: "Authorised dealer" },
  { value: "6,000 sq.ft.", label: "Warehouse near Pashamylaram" },
  { value: `${companyInfo.experienceYears} years`, label: "Experience in chemicals" },
];

export default function BrochureModal({ isOpen, onClose }: BrochureModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-3 backdrop-blur-sm sm:p-6 print:static print:block print:bg-white print:p-0"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brochure-modal-title"
        tabIndex={-1}
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-md bg-paper shadow-[0_40px_120px_-30px_rgba(4,11,22,0.7)] ring-1 ring-white/10 outline-none print:max-h-none print:overflow-visible print:rounded-none print:shadow-none print:ring-0"
      >
        {/* Slim dark control band */}
        <div className="grain relative flex shrink-0 items-center justify-between gap-3 overflow-hidden bg-ink-900 px-4 py-3.5 text-white sm:px-6 no-print">
          <div className="hex-lattice mask-fade-b absolute inset-0" />
          <div className="relative flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white/5 text-brand-300 ring-1 ring-white/10">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 id="brochure-modal-title" className="truncate text-base font-semibold sm:text-lg">
                Product line card
              </h3>
              <div className="truncate font-mono text-xs text-slate-400">{productsData.length} products · typical data</div>
            </div>
          </div>

          <div className="relative flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print / Save as PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full text-slate-300 ring-1 ring-white/15 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close line card"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable brochure body */}
        <div className="overflow-y-auto p-3 sm:p-6 print:overflow-visible print:p-0">
          <div className="lab-grid-light relative rounded-md bg-white p-5 text-slate-800 ring-1 ring-line sm:p-10 print:rounded-none print:p-0 print:ring-0">
            {/* Letterhead */}
            <div className="flex flex-col items-start justify-between gap-6 border-b-2 border-ink-900 pb-6 md:flex-row md:items-end">
              <div>
                <div className="flex items-start gap-2 font-mono text-xs uppercase tracking-[0.16em] text-brand-700">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Authorised dealer · Grasim Industries Ltd. · Aditya Birla Chemicals</span>
                </div>
                <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-ink-900 sm:text-4xl">
                  Kanyaka Corporation
                </h1>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
                  Chloro-alkali products, acids, specialty chemicals and solvents for Indian manufacturing industry.
                  {" "}{companyInfo.motto}
                </p>
              </div>

              <div className="space-y-1.5 text-sm text-slate-600 md:text-right">
                <div className="flex items-center gap-2 font-mono font-semibold text-ink-900 md:justify-end">
                  <Phone className="h-4 w-4 text-brand-600" />
                  {companyInfo.contacts.phonePrimary} · {companyInfo.contacts.phoneSecondary}
                </div>
                <div className="flex items-center gap-2 break-all font-mono md:justify-end">
                  <Mail className="h-4 w-4 shrink-0 text-brand-600" />
                  {companyInfo.contacts.emailDirector} · {companyInfo.contacts.emailSales}
                </div>
                <div className="md:text-right">{companyInfo.operatingHours}</div>
                <div>KPHB Colony, Kukatpally, Hyderabad 500085</div>
              </div>
            </div>

            {/* Pillars */}
            <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-md bg-line ring-1 ring-line sm:grid-cols-3">
              {pillars.map((p) => (
                <div key={p.value} className="bg-paper px-5 py-5">
                  <div className="font-display text-2xl font-semibold tracking-tight text-ink-900">{p.value}</div>
                  <div className="mt-1 text-sm text-slate-600">{p.label}</div>
                </div>
              ))}
            </div>

            {/* Catalogue table */}
            <div className="mt-10">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-brand-700">Line card</div>
              <h2 className="mt-2 text-2xl font-semibold text-ink-900">Products &amp; standard packing</h2>
              <p className="mt-2 text-sm text-slate-600">
                Grades are typical. The manufacturer&apos;s batch COA is final. {godownCount} products are held as godown
                stock; the rest are supplied against order.
              </p>
              <div className="mt-5 overflow-x-auto rounded-md ring-1 ring-line">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-paper font-mono text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-4 py-3 font-normal">Product</th>
                      <th className="px-4 py-3 font-normal">Grade / purity</th>
                      <th className="px-4 py-3 font-normal">Make / brand</th>
                      <th className="px-4 py-3 font-normal">CAS no.</th>
                      <th className="px-4 py-3 font-normal">Standard packaging</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsData.map((prod) => (
                      <tr key={prod.id} className="border-t border-line align-top transition-colors hover:bg-paper/60">
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-ink-900">{prod.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-brand-700">{tileSymbol(prod)}</span>
                            {(prod.isGrasimAuthorized || prod.manufacturer === "Aditya Birla Chemicals") && (
                              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                                Authorised dealer
                              </span>
                            )}
                            {prod.fromGodown && (
                              <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200">
                                Godown stock
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-700">{prod.grade}</td>
                        <td className="px-4 py-3.5 text-slate-600">{prod.manufacturer}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 font-mono text-slate-500">{prod.casNumber}</td>
                        <td className="px-4 py-3.5 text-slate-600">{prod.packagingOptions[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Depot & ordering */}
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-md bg-paper p-6 ring-1 ring-line">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-brand-700">
                  <Warehouse className="h-4 w-4" />
                  Warehouse
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  About 6,000 sq.ft. near the Pashamylaram industrial estate, Medak District (now Sangareddy),
                  Telangana. We hold stock of Grasim Industries and Aditya Birla Chemicals products here.
                </p>
              </div>
              <div className="rounded-md bg-paper p-6 ring-1 ring-line">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-brand-700">
                  <MapPin className="h-4 w-4" />
                  Office &amp; ordering
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                  {companyInfo.addresses.registeredOffice.line1}, {companyInfo.addresses.registeredOffice.line2},
                  {" "}{companyInfo.addresses.registeredOffice.city} {companyInfo.addresses.registeredOffice.pincode}.
                  Call {companyInfo.contacts.phonePrimary} or {companyInfo.contacts.phoneSecondary} for price and
                  availability.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 flex flex-col gap-2 border-t-2 border-ink-900 pt-5 font-mono text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <div>Kanyaka Corporation · Promoter: {companyInfo.promoter.name}</div>
              <div>Authorised Grasim dealer for caustic soda · Telangana &amp; Andhra Pradesh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
