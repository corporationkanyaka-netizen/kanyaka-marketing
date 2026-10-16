import { prisma } from "@/server/db";
import { ApiError } from "@/server/http";
import { Prisma } from "@/generated/prisma/client";
import type { ActivityType, EnquiryStatus } from "@/generated/prisma/enums";
import { productsData } from "@/data/products";
import {
  parseQuantity,
  type CreateEnquiry,
  listEnquiriesQuerySchema,
  logActivitySchema,
  updateEnquirySchema,
} from "@/lib/validation/enquiry";
import type { z } from "zod";

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

const istYear = (d: Date) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", year: "numeric" }).format(d);
export const formatReference = (prefix: string, seq: number, createdAt: Date) =>
  `${prefix}-${istYear(createdAt)}-${String(seq).padStart(5, "0")}`;

const publicView = (e: { id: string; reference: string | null; createdAt: Date }) => ({
  id: e.id,
  reference: e.reference,
  createdAt: e.createdAt,
});

// ─────────────────────────── Create (public) ───────────────────────────

export async function createEnquiry(input: CreateEnquiry, meta: { ipHash: string | null; userAgent: string | null }) {
  if (input.idempotencyKey) {
    const existing = await prisma.enquiry.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
    if (existing) return { enquiry: publicView(existing), created: false };
  }

  if (meta.ipHash) {
    const recent = await prisma.enquiry.count({
      where: { ipHash: meta.ipHash, createdAt: { gte: new Date(Date.now() - RATE_LIMIT.windowMs) } },
    });
    if (recent >= RATE_LIMIT.max) {
      throw new ApiError(429, "RATE_LIMITED", "Too many enquiries from this network. Please call us or try again in a few minutes.");
    }
  }

  const product = input.productSlug ? productsData.find((p) => p.slug === input.productSlug) : undefined;
  const parsed = parseQuantity(input.quantity);

  try {
    const enquiry = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { phone: input.phone },
        create: { phone: input.phone, name: input.name, companyName: input.company, email: input.email },
        update: { name: input.name, companyName: input.company, ...(input.email ? { email: input.email } : {}) },
      });

      const created = await tx.enquiry.create({
        data: {
          source: input.source,
          customerId: customer.id,
          contactName: input.name,
          companyName: input.company,
          phone: input.phone,
          email: input.email,
          deliveryLocation: input.deliveryLocation,
          message: input.message,
          wantsCoa: input.wantsCoa,
          idempotencyKey: input.idempotencyKey,
          pageUrl: input.pageUrl,
          ipHash: meta.ipHash,
          userAgent: meta.userAgent?.slice(0, 300),
          items: {
            create: {
              productSlug: product?.slug ?? null,
              productName: product?.name ?? "Other chemical",
              quantityText: input.quantity,
              quantity: parsed?.quantity,
              unit: parsed?.unit,
            },
          },
          activities: { create: { type: "CREATED", actor: "website", note: `Submitted via ${input.source}` } },
        },
      });

      return tx.enquiry.update({
        where: { id: created.id },
        data: { reference: formatReference("KC-ENQ", created.seq, created.createdAt) },
      });
    });
    return { enquiry: publicView(enquiry), created: true };
  } catch (err) {
    // Two identical submits racing: the loser returns the winner's enquiry.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002" && input.idempotencyKey) {
      const existing = await prisma.enquiry.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
      if (existing) return { enquiry: publicView(existing), created: false };
    }
    throw err;
  }
}

// ─────────────────────────── Admin ───────────────────────────

export async function listEnquiries(query: z.output<typeof listEnquiriesQuerySchema>) {
  const where: Prisma.EnquiryWhereInput = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.source ? { source: query.source } : {}),
    ...(query.from || query.to
      ? {
          createdAt: {
            ...(query.from ? { gte: new Date(`${query.from}T00:00:00+05:30`) } : {}),
            ...(query.to ? { lte: new Date(`${query.to}T23:59:59.999+05:30`) } : {}),
          },
        }
      : {}),
    ...(query.q
      ? {
          OR: [
            { reference: { contains: query.q, mode: "insensitive" } },
            { contactName: { contains: query.q, mode: "insensitive" } },
            { companyName: { contains: query.q, mode: "insensitive" } },
            { email: { contains: query.q, mode: "insensitive" } },
            { deliveryLocation: { contains: query.q, mode: "insensitive" } },
            ...(query.q.replace(/\D/g, "").length >= 4 ? [{ phone: { contains: query.q.replace(/\D/g, "") } }] : []),
            { items: { some: { productName: { contains: query.q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [total, rows] = await prisma.$transaction([
    prisma.enquiry.count({ where }),
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: {
        id: true,
        reference: true,
        status: true,
        source: true,
        contactName: true,
        companyName: true,
        phone: true,
        email: true,
        deliveryLocation: true,
        wantsCoa: true,
        createdAt: true,
        respondedAt: true,
        items: { select: { productSlug: true, productName: true, quantityText: true, quantity: true, unit: true } },
        _count: { select: { quotes: true } },
      },
    }),
  ]);

  return { items: rows, page: query.page, pageSize: query.pageSize, total, totalPages: Math.ceil(total / query.pageSize) };
}

export async function getEnquiry(id: string) {
  return prisma.enquiry.findUniqueOrThrow({
    where: { id },
    include: {
      customer: { include: { _count: { select: { enquiries: true } } } },
      items: { orderBy: { createdAt: "asc" } },
      quotes: { orderBy: { createdAt: "desc" }, include: { items: { orderBy: { position: "asc" } } } },
      activities: { orderBy: { createdAt: "asc" } },
    },
  });
}

/** Moves NEW → CONTACTED the first time staff act on an enquiry. Returns activity rows to add. */
function firstResponse(current: { status: EnquiryStatus; respondedAt: Date | null }, actor?: string) {
  if (current.status !== "NEW") return null;
  return {
    data: { status: "CONTACTED" as const, respondedAt: current.respondedAt ?? new Date() },
    activity: { type: "STATUS_CHANGED" as ActivityType, fromStatus: "NEW", toStatus: "CONTACTED", actor },
  };
}

export async function updateEnquiry(id: string, input: z.output<typeof updateEnquirySchema>) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.enquiry.findUniqueOrThrow({ where: { id } });

    if (input.status && input.status !== current.status) {
      if (input.status === "NEW") throw new ApiError(409, "INVALID_TRANSITION", "An enquiry cannot be moved back to NEW");
      await tx.enquiry.update({
        where: { id },
        data: {
          status: input.status,
          ...(current.respondedAt ? {} : { respondedAt: new Date() }),
          activities: {
            create: { type: "STATUS_CHANGED", fromStatus: current.status, toStatus: input.status, note: input.note, actor: input.actor },
          },
        },
      });
    } else if (input.note) {
      await tx.activity.create({ data: { enquiryId: id, type: "NOTE", note: input.note, actor: input.actor } });
    }

    return tx.enquiry.findUniqueOrThrow({ where: { id }, include: { activities: { orderBy: { createdAt: "asc" } } } });
  });
}

export async function logActivity(id: string, input: z.output<typeof logActivitySchema>) {
  return prisma.$transaction(async (tx) => {
    const current = await tx.enquiry.findUniqueOrThrow({ where: { id } });
    const activity = await tx.activity.create({ data: { enquiryId: id, type: input.type, note: input.note, actor: input.actor } });

    // A call / message / email counts as the first response.
    const first = input.type !== "NOTE" ? firstResponse(current, input.actor) : null;
    if (first) {
      await tx.enquiry.update({ where: { id }, data: { ...first.data, activities: { create: first.activity } } });
    }
    return activity;
  });
}

