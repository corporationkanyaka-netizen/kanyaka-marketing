"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { companyInfo } from "@/data/company";
import { whatsappMessageSchema } from "@/lib/validation/enquiry";
import { AlertCircle, CheckCheck, Clock3, SendHorizontal, X } from "lucide-react";

const WA_NUMBER = companyInfo.contacts.whatsapp.replace(/[^0-9]/g, "");
const CONTACT_KEY = "kc-chat-contact";

const quickReplies = [
  "Price for Caustic Soda Flakes",
  "Is this chemical in stock?",
  "I need a quotation",
  "Can you share the manufacturer COA?",
];

type Contact = { name: string; phone: string };
type Msg = { id: number; text: string; status: "sending" | "delivered" | "failed"; error?: string };

const waLink = (text: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hello Kanyaka Corporation,\n\n${text}`)}`;

function loadContact(): Contact | null {
  try {
    const raw = localStorage.getItem(CONTACT_KEY);
    const parsed = raw ? (JSON.parse(raw) as Contact) : null;
    return parsed?.name && parsed?.phone ? parsed : null;
  } catch {
    return null;
  }
}

function saveContact(c: Contact) {
  try {
    localStorage.setItem(CONTACT_KEY, JSON.stringify(c));
  } catch {
    /* private mode / blocked storage — just don't remember */
  }
}

function WhatsAppGlyph({ className = "" }: { className?: string }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.405z" />
    </svg>
  );
}

/**
 * Floating WhatsApp chat. Messages are sent from the website straight to the sales WhatsApp
 * (POST /api/whatsapp → UltraMsg). If automatic delivery fails, the visitor gets a wa.me fallback.
 */
export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [draft, setDraft] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [askDetails, setAskDetails] = useState<string | null>(null); // message waiting for name/phone
  const [form, setForm] = useState<Contact>({ name: "", phone: "" });
  const [formErrors, setFormErrors] = useState<Partial<Record<"name" | "phone", string>>>({});
  const [honeypot, setHoneypot] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  // Focus, Escape and outside-click handling.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, askDetails]);

  useEffect(() => {
    if (askDetails !== null) nameRef.current?.focus({ preventScroll: true });
  }, [askDetails]);

  // Restore saved details when the chat opens (localStorage isn't available during SSR).
  const openChat = () => {
    if (!contact) {
      const saved = loadContact();
      if (saved) {
        setContact(saved);
        setForm(saved);
      }
    }
    setOpen(true);
    setShowTooltip(false);
  };

  const autosize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const patch = (id: number, update: Partial<Msg>) => setMsgs((list) => list.map((m) => (m.id === id ? { ...m, ...update } : m)));

  const deliver = async (text: string, who: Contact) => {
    const id = nextId.current++;
    setMsgs((list) => [...list, { id, text, status: "sending" }]);
    try {
      const res = await fetch("/api/whatsapp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...who, message: text, pageUrl: window.location.href.slice(0, 500), website: honeypot }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.data?.delivered) return patch(id, { status: "delivered" });
      patch(id, { status: "failed", error: json?.error?.message ?? "We couldn't deliver it automatically." });
    } catch {
      patch(id, { status: "failed", error: "Network problem — you can still send it on WhatsApp." });
    }
  };

  const send = (text: string) => {
    const message = text.trim();
    if (!message) return;
    setDraft("");
    requestAnimationFrame(autosize);
    if (!contact) {
      setAskDetails(message); // collect name + number first, then send
      return;
    }
    void deliver(message, contact);
  };

  const submitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (askDetails === null) return;
    const check = whatsappMessageSchema.pick({ name: true, phone: true }).safeParse(form);
    if (!check.success) {
      const errs: Partial<Record<"name" | "phone", string>> = {};
      for (const issue of check.error.issues) errs[issue.path[0] as "name" | "phone"] ??= issue.message;
      setFormErrors(errs);
      return;
    }
    const who = { name: form.name.trim(), phone: form.phone.trim() };
    setContact(who);
    saveContact(who);
    setFormErrors({});
    const message = askDetails;
    setAskDetails(null);
    void deliver(message, who);
  };

  const pickQuick = (text: string) => {
    const value = `${text} `;
    setDraft(value);
    requestAnimationFrame(() => {
      autosize();
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(value.length, value.length);
    });
  };

  const firstDeliveredId = msgs.find((m) => m.status === "delivered")?.id;
  const fieldClass = (bad?: string) =>
    `w-full rounded-xl bg-white px-3.5 py-2.5 text-[14px] text-ink-900 outline-none ring-1 placeholder:text-slate-400 focus:ring-2 focus:ring-[#25D366]/60 ${
      bad ? "ring-rose-400" : "ring-black/10"
    }`;

  return (
    <div ref={rootRef} className="floating-actions fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="Chat with Kanyaka Corporation on WhatsApp"
          className="flex w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_80px_-20px_rgba(11,22,38,0.55)] ring-1 ring-black/5"
        >
          {/* Header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3.5 text-white">
            <div className="relative">
              <Image src="/icon.png" alt="" width={42} height={42} className="rounded-full ring-2 ring-white/20" />
              <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#25D366] ring-2 ring-[#075E54]">
                <WhatsAppGlyph className="h-2.5 w-2.5 text-white" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold leading-tight">{companyInfo.name}</div>
              <div className="truncate text-xs text-emerald-100/80">Sales desk · {companyInfo.contacts.whatsappDisplay}</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Conversation */}
          <div
            ref={bodyRef}
            aria-live="polite"
            className="max-h-[min(380px,52vh)] space-y-3 overflow-y-auto overscroll-contain bg-[#efeae2] px-4 py-5"
            style={{ backgroundImage: "radial-gradient(rgba(11,22,38,0.05) 1px, transparent 1px)", backgroundSize: "14px 14px" }}
          >
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-900 shadow-sm">
              <div className="mb-0.5 text-xs font-semibold text-[#075E54]">{companyInfo.name}</div>
              Hello! 👋 Welcome to Kanyaka Corporation.
              <br />
              Which chemical do you need — and how much? We&apos;ll reply on WhatsApp with the rate and availability.
            </div>

            {msgs.length === 0 && askDetails === null && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickReplies.map((q) => (
                  <button
                    key={q}
                    onClick={() => pickQuick(q)}
                    className="cursor-pointer rounded-full bg-white/90 px-3 py-1.5 text-[13px] font-medium text-[#075E54] ring-1 ring-[#075E54]/20 transition-colors hover:bg-white hover:ring-[#075E54]/40"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {msgs.map((m) => (
              <div key={m.id} className="flex flex-col items-end gap-1">
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-900 shadow-sm ${
                    m.status === "failed" ? "bg-rose-50 ring-1 ring-rose-200" : "bg-[#d9fdd3]"
                  }`}
                >
                  {m.text}
                  <span className="ml-1.5 inline-block align-[-3px]">
                    {m.status === "sending" && <Clock3 className="h-3.5 w-3.5 text-slate-400" aria-label="Sending" />}
                    {m.status === "delivered" && <CheckCheck className="h-4 w-4 text-[#53bdeb]" aria-label="Delivered" />}
                    {m.status === "failed" && <AlertCircle className="h-4 w-4 text-rose-500" aria-label="Not delivered" />}
                  </span>
                </div>
                {m.status === "failed" && (
                  <div className="flex max-w-[85%] flex-col items-end gap-1.5 text-right text-[12px] text-rose-700">
                    <span>{m.error}</span>
                    <a
                      href={waLink(m.text)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-[#1ebe5a]"
                    >
                      <WhatsAppGlyph className="h-3.5 w-3.5" />
                      Send via WhatsApp instead
                    </a>
                  </div>
                )}
                {m.id === firstDeliveredId && contact && (
                  <div className="mt-2 max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-ink-900 shadow-sm">
                    <div className="mb-0.5 text-xs font-semibold text-[#075E54]">{companyInfo.name}</div>
                    Thanks, {contact.name.split(" ")[0]}! Your message has reached our sales desk. We&apos;ll reply on WhatsApp at{" "}
                    <span className="font-medium">{contact.phone}</span>.
                  </div>
                )}
              </div>
            ))}


            {/* Details card — asked once, before the first message is sent */}
            {askDetails !== null && (
              <form onSubmit={submitDetails} noValidate className="space-y-2.5 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-[#075E54]/15">
                <div className="text-[13px] leading-snug text-slate-600">
                  So our team can reply to you on WhatsApp, please share your name and number.
                </div>
                <div>
                  <input
                    ref={nameRef}
                    value={form.name}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, name: e.target.value }));
                      setFormErrors((x) => ({ ...x, name: undefined }));
                    }}
                    placeholder="Your name"
                    aria-label="Your name"
                    aria-invalid={!!formErrors.name}
                    autoComplete="name"
                    maxLength={100}
                    className={fieldClass(formErrors.name)}
                  />
                  {formErrors.name && <p className="mt-1 text-xs text-rose-600">{formErrors.name}</p>}
                </div>
                <div>
                  <input
                    value={form.phone}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, phone: e.target.value }));
                      setFormErrors((x) => ({ ...x, phone: undefined }));
                    }}
                    placeholder="WhatsApp number, e.g. 98490 12345"
                    aria-label="Your WhatsApp number"
                    aria-invalid={!!formErrors.phone}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={20}
                    className={`${fieldClass(formErrors.phone)} font-mono`}
                  />
                  {formErrors.phone && <p className="mt-1 text-xs text-rose-600">{formErrors.phone}</p>}
                </div>
                {/* Honeypot */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
                </div>
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(askDetails);
                      setAskDetails(null);
                    }}
                    className="cursor-pointer text-[13px] text-slate-500 hover:text-slate-700"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1ebe5a]"
                  >
                    Send message
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
            className="flex items-end gap-2 border-t border-black/5 bg-[#f0f2f5] p-2.5"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              disabled={askDetails !== null}
              onChange={(e) => {
                setDraft(e.target.value);
                autosize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder={askDetails !== null ? "Add your details above" : "Type a message"}
              aria-label="Your message"
              maxLength={1000}
              className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-2xl bg-white px-4 py-[11px] text-[15px] leading-snug text-ink-900 outline-none ring-1 ring-black/5 placeholder:text-slate-400 focus:ring-[#25D366]/60 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!draft.trim() || askDetails !== null}
              aria-label="Send"
              className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-[#25D366] text-white transition-all hover:bg-[#1ebe5a] disabled:cursor-default disabled:bg-slate-300"
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 bg-[#f0f2f5] px-4 pb-2.5 text-center text-[11px] text-slate-500">
            {contact ? (
              <>
                Replying to {contact.name} · {contact.phone}
                <button
                  onClick={() => {
                    setContact(null);
                    setForm({ name: "", phone: "" });
                    try {
                      localStorage.removeItem(CONTACT_KEY);
                    } catch {
                      /* ignore */
                    }
                  }}
                  className="cursor-pointer font-medium text-[#075E54] hover:underline"
                >
                  change
                </button>
              </>
            ) : (
              <>Messages go straight to our sales WhatsApp</>
            )}
          </div>
        </div>
      )}

      {/* Launcher */}
      <div className="flex items-end gap-3">
        {showTooltip && !open && (
          <div className="hidden max-w-xs items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm text-ink-900 shadow-[0_20px_50px_-20px_rgba(11,22,38,0.45)] ring-1 ring-line sm:flex">
            <button onClick={openChat} className="cursor-pointer text-left">
              Need a rate? Chat with our sales desk
            </button>
            <button
              onClick={() => setShowTooltip(false)}
              className="ml-1 cursor-pointer p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Dismiss tooltip"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <button
          onClick={() => (open ? setOpen(false) : openChat())}
          aria-expanded={open}
          aria-label={open ? "Close WhatsApp chat" : "Chat with Kanyaka Corporation on WhatsApp"}
          className="relative grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-600/40 ring-4 ring-white transition-all duration-300 hover:scale-105 hover:shadow-emerald-600/60"
        >
          {open ? <X className="h-6 w-6" /> : <WhatsAppGlyph className="h-7 w-7" />}
        </button>
      </div>
    </div>
  );
}
