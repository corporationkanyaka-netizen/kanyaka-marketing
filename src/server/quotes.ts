import { prisma } from "@/server/db";
import { ApiError } from "@/server/http";
import { formatReference } from "@/server/enquiries";
import type { QuoteStatus } from "@/generated/prisma/enums";
import type { CreateQuote, updateQuoteSchema } from "@/lib/validation/enquiry";
import type { z } from "zod";

// ─────────────────────────── Money ───────────────────────────
// All arithmetic is done in integer paise with BigInt, then rounded half-up per line.

const [N0, N2, N100, N1000, N10000] = [0, 2, 100, 1000, 10000].map((n) => BigInt(n));

const toPaise = (rupees: number) => BigInt(Math.round(rupees * 100));
const toMilli = (qty: number) => BigInt(Math.round(qty * 1000));
const roundDiv = (n: bigint, d: bigint) => (n >= N0 ? (n + d / N2) / d : -((-n + d / N2) / d));
const paiseToString = (p: bigint) => {
  const sign = p < N0 ? "-" : "";
  const abs = p < N0 ? -p : p;
  return `${sign}${abs / N100}.${String(abs % N100).padStart(2, "0")}`;
};

export function priceQuote(input: Pick<CreateQuote, "items" | "freight">) {
  let subtotal = N0;
  let tax = N0;
  const lines = input.items.map((item, i) => {
    const lineSubtotal = roundDiv(toMilli(item.quantity) * toPaise(item.unitPrice), N1000);
    const gstBasisPoints = BigInt(Math.round(item.gstRate * 100)); // 18% → 1800
    const lineTax = roundDiv(lineSubtotal * gstBasisPoints, N10000);
    subtotal += lineSubtotal;
    tax += lineTax;
    return {
      position: i + 1,
      productSlug: item.productSlug,
      description: item.description,
      quantity: item.quantity.toString(),
      unit: item.unit,
      unitPrice: item.unitPrice.toFixed(2),
      gstRate: item.gstRate.toFixed(2),
      lineSubtotal: paiseToString(lineSubtotal),
      lineTax: paiseToString(lineTax),
      lineTotal: paiseToString(lineSubtotal + lineTax),
    };
  });
  const freight = toPaise(input.freight);
  return {
    lines,
    subtotal: paiseToString(subtotal),
    taxTotal: paiseToString(tax),
    freight: paiseToString(freight),
    total: paiseToString(subtotal + tax + freight),
  };
}

// ─────────────────────────── Lifecycle ───────────────────────────

const transitions: Record<QuoteStatus, QuoteStatus[]> = {
  DRAFT: ["SENT", "CANCELLED"],
  SENT: ["ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"],
  ACCEPTED: [],
  REJECTED: [],
  EXPIRED: [],
  CANCELLED: [],
};

const quoteInclude = {
  items: { orderBy: { position: "asc" as const } },
  enquiry: { select: { id: true, reference: true, status: true, contactName: true, companyName: true, phone: true, email: true } },
};

export async function createQuote(enquiryId: string, input: CreateQuote) {
  const priced = priceQuote(input);

  return prisma.$transaction(async (tx) => {
    const enquiry = await tx.enquiry.findUniqueOrThrow({ where: { id: enquiryId } });
    if (enquiry.status === "SPAM") throw new ApiError(409, "ENQUIRY_IS_SPAM", "Cannot quote an enquiry marked as spam");

    const now = new Date();
    const created = await tx.quote.create({
      data: {
        enquiryId,
        status: input.status,
        validUntil: input.validUntil ? new Date(`${input.validUntil}T00:00:00Z`) : undefined,
        subtotal: priced.subtotal,
        taxTotal: priced.taxTotal,
        freight: priced.freight,
        total: priced.total,
        paymentTerms: input.paymentTerms,
        deliveryTerms: input.deliveryTerms,
        notes: input.notes,
        createdBy: input.createdBy,
        sentAt: input.status === "SENT" ? now : undefined,
        items: { create: priced.lines },
      },
    });
    const quoteNumber = formatReference("KC-QT", created.seq, created.createdAt);
    await tx.quote.update({ where: { id: created.id }, data: { quoteNumber } });

    await tx.activity.create({
      data: { enquiryId, quoteId: created.id, type: "QUOTE_CREATED", toStatus: input.status, note: `${quoteNumber} · ₹${priced.total}`, actor: input.createdBy },
    });
    if (input.status === "SENT") await markQuoted(tx, enquiry, input.createdBy);

    return tx.quote.findUniqueOrThrow({ where: { id: created.id }, include: quoteInclude });
  });
}

export async function getQuote(id: string) {
  return prisma.quote.findUniqueOrThrow({ where: { id }, include: quoteInclude });
}

export async function updateQuote(id: string, input: z.output<typeof updateQuoteSchema>) {
  return prisma.$transaction(async (tx) => {
    const quote = await tx.quote.findUniqueOrThrow({ where: { id }, include: { enquiry: true } });
    if (!transitions[quote.status].includes(input.status)) {
      throw new ApiError(409, "INVALID_TRANSITION", `This quote is ${quote.status}; it cannot be changed to ${input.status}`);
    }

    const now = new Date();
    await tx.quote.update({
      where: { id },
      data: {
        status: input.status,
        ...(input.status === "SENT" ? { sentAt: now } : {}),
        ...(["ACCEPTED", "REJECTED", "EXPIRED", "CANCELLED"].includes(input.status) ? { decidedAt: now } : {}),
      },
    });
    await tx.activity.create({
      data: { enquiryId: quote.enquiryId, quoteId: id, type: "QUOTE_STATUS_CHANGED", fromStatus: quote.status, toStatus: input.status, note: input.note, actor: input.actor },
    });

    if (input.status === "SENT") await markQuoted(tx, quote.enquiry, input.actor);
    if (input.status === "ACCEPTED" && quote.enquiry.status !== "WON") {
      await tx.enquiry.update({
        where: { id: quote.enquiryId },
        data: {
          status: "WON",
          activities: { create: { type: "STATUS_CHANGED", fromStatus: quote.enquiry.status, toStatus: "WON", note: `Quote ${quote.quoteNumber} accepted`, actor: input.actor } },
        },
      });
    }

    return tx.quote.findUniqueOrThrow({ where: { id }, include: quoteInclude });
  });
}

type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/** Sending a quote moves a fresh enquiry to QUOTED. */
async function markQuoted(tx: Tx, enquiry: { id: string; status: string; respondedAt: Date | null }, actor?: string) {
  if (enquiry.status !== "NEW" && enquiry.status !== "CONTACTED") return;
  await tx.enquiry.update({
    where: { id: enquiry.id },
    data: {
      status: "QUOTED",
      respondedAt: enquiry.respondedAt ?? new Date(),
      activities: { create: { type: "STATUS_CHANGED", fromStatus: enquiry.status, toStatus: "QUOTED", actor } },
    },
  });
}
