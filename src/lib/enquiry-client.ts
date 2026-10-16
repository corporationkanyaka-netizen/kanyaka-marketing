// Browser-side helper used by every enquiry form.
// Validates with the same schema as the API, then POSTs to /api/enquiries.

import { productsData } from "@/data/products";
import { createEnquirySchema, type CreateEnquiryInput } from "@/lib/validation/enquiry";

export type FieldErrors = Partial<Record<string, string>>;

export type SubmitResult =
  | { ok: true; reference: string | null }
  | { ok: false; message: string; fieldErrors: FieldErrors };

/** Forms hold product *names* (that's what the picker shows); the API wants catalogue slugs. */
export function slugForProductName(name: string): string | null {
  return productsData.find((p) => p.name === name)?.slug ?? null;
}

export function newIdempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (Number(c) ^ (Math.floor(Math.random() * 16) >> (Number(c) / 4))).toString(16),
      );
}

export async function submitEnquiry(payload: Omit<CreateEnquiryInput, "pageUrl">): Promise<SubmitResult> {
  const body = { ...payload, pageUrl: typeof window !== "undefined" ? window.location.href.slice(0, 500) : undefined };

  // Instant client-side check — same rules the server enforces.
  const local = createEnquirySchema.safeParse(body);
  if (!local.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of local.error.issues) {
      const key = issue.path.join(".") || "form";
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, message: "Please correct the highlighted fields.", fieldErrors };
  }

  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (res.ok) return { ok: true, reference: json?.data?.reference ?? null };

    const fieldErrors: FieldErrors = {};
    for (const [key, messages] of Object.entries((json?.error?.fields ?? {}) as Record<string, string[]>)) {
      fieldErrors[key] = messages[0];
    }
    return { ok: false, message: json?.error?.message ?? "Could not send your enquiry.", fieldErrors };
  } catch {
    return { ok: false, message: "Network problem — please check your connection, or call us directly.", fieldErrors: {} };
  }
}
