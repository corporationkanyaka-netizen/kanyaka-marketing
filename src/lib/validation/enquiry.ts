// Shared validation for enquiries and quotes.
// Imported by the browser forms (instant feedback) AND the API (authoritative check),
// so the rules can never drift apart. Keep this file free of server-only imports.

import { z } from "zod";
import { productsData } from "@/data/products";

export const productSlugs = productsData.map((p) => p.slug) as [string, ...string[]];

export const PUBLIC_SOURCES = ["CONTACT_PAGE", "QUOTE_MODAL", "PRODUCT_PAGE"] as const;
export const STAFF_SOURCES = ["PHONE", "WHATSAPP", "EMAIL", "WALK_IN", "OTHER"] as const;
export const ENQUIRY_STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST", "SPAM"] as const;
export const QUANTITY_UNITS = ["KG", "MT", "BAGS", "DRUMS", "CARBOYS", "LITRES", "KL", "TANKERS", "OTHER"] as const;
export const QUOTE_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"] as const;
export const LOGGABLE_ACTIVITIES = ["NOTE", "CALL", "WHATSAPP", "EMAIL"] as const;

// ─────────────────────────── Phone ───────────────────────────

/**
 * Normalise to E.164. Accepts Indian mobiles (98490 12345, +91 98490 12345, 919849012345),
 * Indian landlines with STD code (e.g. 040-12345678) and other international numbers in +CC form.
 */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (trimmed.startsWith("+")) {
    if (digits.startsWith("91")) return digits.length === 12 ? `+${digits}` : null;
    return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : null;
  }
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `+91${digits}`; // mobile
  if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`; // landline / 0-prefixed mobile
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

// ─────────────────────────── Quantity ───────────────────────────

const unitPatterns: [RegExp, (typeof QUANTITY_UNITS)[number]][] = [
  [/^(mt|m\.t\.?|tons?|tonnes?|t)$/i, "MT"],
  [/^(kgs?|kilos?|kilograms?)$/i, "KG"],
  [/^bags?$/i, "BAGS"],
  [/^(drums?|barrels?)$/i, "DRUMS"],
  [/^(carboys?|cans?)$/i, "CARBOYS"],
  [/^(l|ltrs?|litres?|liters?)$/i, "LITRES"],
  [/^(kl|kilolitres?|kiloliters?)$/i, "KL"],
  [/^(tankers?|loads?)$/i, "TANKERS"],
];

/** Best-effort read of the first "<number> <unit>" in free text, e.g. "10 MT in 50 kg bags" → 10 MT. */
export function parseQuantity(text: string): { quantity: number; unit: (typeof QUANTITY_UNITS)[number] } | null {
  const match = text.match(/(\d+(?:[.,]\d+)?)\s*([a-z.]+)/i);
  if (!match) return null;
  const quantity = Number(match[1].replace(",", "."));
  const unit = unitPatterns.find(([re]) => re.test(match[2]))?.[1];
  if (!unit || !Number.isFinite(quantity) || quantity <= 0) return null;
  return { quantity: Math.round(quantity * 1000) / 1000, unit };
}

// ─────────────────────────── Field helpers ───────────────────────────

const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`)
    .max(max, `${label} must be at most ${max} characters`);

const optionalText = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, `${label} must be at most ${max} characters`)
    .optional()
    .transform((v) => (v ? v : undefined));

const phone = z
  .string({ error: "Phone number is required" })
  .trim()
  .min(1, "Phone number is required")
  .transform((v, ctx) => {
    const normalized = normalizePhone(v);
    if (!normalized) {
      ctx.addIssue({ code: "custom", message: "Enter a valid phone number, e.g. 98490 12345" });
      return z.NEVER;
    }
    return normalized;
  });

const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .optional()
  .transform((v) => (v ? v : undefined))
  .pipe(z.email("Enter a valid email address").optional());

// ─────────────────────────── Public enquiry ───────────────────────────

export const createEnquirySchema = z
  .object({
    source: z.enum(PUBLIC_SOURCES),
    name: text(2, 100, "Name"),
    company: text(2, 150, "Company"),
    phone,
    email: optionalEmail,
    /** Catalogue slug, or null for "other chemical" (then `message` must say which). */
    productSlug: z.enum(productSlugs, { error: "Choose a chemical from the list" }).nullable(),
    quantity: text(1, 100, "Quantity"),
    deliveryLocation: text(2, 200, "Delivery location"),
    message: optionalText(2000, "Message"),
    wantsCoa: z.boolean().default(false),
    idempotencyKey: z.uuid().optional(),
    pageUrl: z.string().trim().max(500).optional(),
    /** Honeypot — real users never see or fill this. */
    website: z.string().max(200).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.productSlug === null && !v.message) {
      ctx.addIssue({ code: "custom", path: ["message"], message: "Tell us which chemical you need" });
    }
  });

export type CreateEnquiryInput = z.input<typeof createEnquirySchema>;
export type CreateEnquiry = z.output<typeof createEnquirySchema>;

// ─────────────────────────── Admin ───────────────────────────

export const listEnquiriesQuerySchema = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  source: z.enum([...PUBLIC_SOURCES, ...STAFF_SOURCES]).optional(),
  q: z.string().trim().max(100).optional(),
  from: z.iso.date().optional(),
  to: z.iso.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const updateEnquirySchema = z
  .object({
    status: z.enum(ENQUIRY_STATUSES).optional(),
    note: optionalText(2000, "Note"),
    actor: optionalText(80, "Actor"),
  })
  .refine((v) => v.status || v.note, { message: "Provide a status and/or a note" });

export const logActivitySchema = z.object({
  type: z.enum(LOGGABLE_ACTIVITIES),
  note: text(1, 2000, "Note"),
  actor: optionalText(80, "Actor"),
});

const decimalPlaces = (n: number, places: number) => Math.abs(Math.round(n * 10 ** places) - n * 10 ** places) < 1e-6;

const quoteItemSchema = z.object({
  productSlug: z.enum(productSlugs).nullable().default(null),
  description: text(1, 200, "Description"),
  quantity: z
    .number()
    .positive("Quantity must be more than 0")
    .max(1_000_000)
    .refine((n) => decimalPlaces(n, 3), "Quantity can have at most 3 decimals"),
  unit: z.enum(QUANTITY_UNITS),
  unitPrice: z
    .number()
    .min(0, "Price cannot be negative")
    .max(100_000_000)
    .refine((n) => decimalPlaces(n, 2), "Price can have at most 2 decimals"),
  gstRate: z.number().min(0).max(28).default(18),
});

export const createQuoteSchema = z.object({
  items: z.array(quoteItemSchema).min(1, "Add at least one line").max(50),
  freight: z
    .number()
    .min(0)
    .max(100_000_000)
    .refine((n) => decimalPlaces(n, 2), "Freight can have at most 2 decimals")
    .default(0),
  validUntil: z.iso.date().optional(),
  paymentTerms: optionalText(300, "Payment terms"),
  deliveryTerms: optionalText(300, "Delivery terms"),
  notes: optionalText(2000, "Notes"),
  status: z.enum(["DRAFT", "SENT"]).default("DRAFT"),
  createdBy: optionalText(80, "Created by"),
});

export type CreateQuote = z.output<typeof createQuoteSchema>;

export const updateQuoteSchema = z.object({
  status: z.enum(["SENT", "ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"]),
  note: optionalText(2000, "Note"),
  actor: optionalText(80, "Actor"),
});

// ─────────────────────────── Website WhatsApp chat ───────────────────────────

export const whatsappMessageSchema = z.object({
  name: text(2, 100, "Name"),
  phone,
  company: optionalText(150, "Company"),
  email: optionalEmail,
  message: text(1, 1000, "Message"),
  pageUrl: z.string().trim().max(500).optional(),
  /** Honeypot — real users never see or fill this. */
  website: z.string().max(200).optional(),
});

export type WhatsAppMessageInput = z.input<typeof whatsappMessageSchema>;
