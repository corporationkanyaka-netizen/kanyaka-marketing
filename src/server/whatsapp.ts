import { prisma } from "@/server/db";
import { ApiError } from "@/server/http";
import type { z } from "zod";
import type { whatsappMessageSchema } from "@/lib/validation/enquiry";

// Delivers website chat messages to the sales WhatsApp through UltraMsg
// (https://docs.ultramsg.com — POST /{instance}/messages/chat).

const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 };

type Input = z.output<typeof whatsappMessageSchema>;
export type DeliveryResult = { id: string; delivered: true } | { id: string; delivered: false; reason: string };

function ultramsgConfig() {
  const instance = process.env.ULTRAMSG_INSTANCE_ID?.trim();
  const token = process.env.ULTRAMSG_TOKEN?.trim();
  const to = process.env.WHATSAPP_NOTIFY_TO?.replace(/\D/g, "");
  return instance && token && to ? { instance, token, to } : null;
}

function formatForSales(input: Input) {
  const digits = input.phone.replace(/\D/g, "");
  return [
    "*New website chat — Kanyaka Corporation*",
    "",
    `*Name:* ${input.name}`,
    `*WhatsApp:* ${input.phone}`,
    `*Reply:* https://wa.me/${digits}`,
    ...(input.pageUrl ? [`*Page:* ${input.pageUrl}`] : []),
    "",
    "*Message:*",
    input.message,
  ].join("\n");
}

async function sendViaUltramsg(body: string): Promise<{ ok: true; providerId: string | null } | { ok: false; error: string }> {
  const cfg = ultramsgConfig();
  if (!cfg) return { ok: false, error: "WhatsApp delivery is not configured" };

  try {
    const res = await fetch(`https://api.ultramsg.com/${encodeURIComponent(cfg.instance)}/messages/chat`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: cfg.token, to: cfg.to, body, priority: "1" }),
      signal: AbortSignal.timeout(10_000),
    });
    const json = (await res.json().catch(() => null)) as { sent?: string | boolean; id?: string | number; error?: unknown } | null;
    if (res.ok && json && (json.sent === true || json.sent === "true")) {
      return { ok: true, providerId: json.id != null ? String(json.id) : null };
    }
    const error = typeof json?.error === "string" ? json.error : JSON.stringify(json?.error ?? json ?? `HTTP ${res.status}`);
    return { ok: false, error: error.slice(0, 300) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message.slice(0, 300) : "Network error" };
  }
}

/** Store the message, then try to deliver it. Never throws on delivery failure — the caller falls back to wa.me. */
export async function submitWhatsAppMessage(input: Input, meta: { ipHash: string | null }): Promise<DeliveryResult> {
  if (meta.ipHash) {
    const recent = await prisma.whatsAppMessage.count({
      where: { ipHash: meta.ipHash, createdAt: { gte: new Date(Date.now() - RATE_LIMIT.windowMs) } },
    });
    if (recent >= RATE_LIMIT.max) {
      throw new ApiError(429, "RATE_LIMITED", "Too many messages from this network. Please try again in a few minutes or call us.");
    }
  }

  const row = await prisma.whatsAppMessage.create({
    data: { name: input.name, phone: input.phone, message: input.message, pageUrl: input.pageUrl, ipHash: meta.ipHash },
  });

  const result = await sendViaUltramsg(formatForSales(input));
  if (result.ok) {
    await prisma.whatsAppMessage.update({
      where: { id: row.id },
      data: { status: "SENT", providerId: result.providerId, sentAt: new Date() },
    });
    return { id: row.id, delivered: true };
  }

  console.warn("[whatsapp] delivery failed:", result.error);
  await prisma.whatsAppMessage.update({ where: { id: row.id }, data: { status: "FAILED", error: result.error } });
  return { id: row.id, delivered: false, reason: "WhatsApp delivery is temporarily unavailable" };
}
