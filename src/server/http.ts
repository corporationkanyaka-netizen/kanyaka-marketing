import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

// Every API response is either { data } or { error: { code, message, fields? } }.

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

export const ok = (data: unknown, status = 200) => Response.json({ data }, { status });

export function fail(status: number, code: string, message: string, fields?: Record<string, string[]>) {
  return Response.json({ error: { code, message, ...(fields ? { fields } : {}) } }, { status });
}

/** Wrap a route handler so thrown ApiErrors / validation / DB errors become clean JSON. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof ApiError) return fail(err.status, err.code, err.message, err.fields);
      if (err instanceof z.ZodError) {
        // Keyed by dotted path, e.g. "phone" or "items.0.unitPrice", so forms can highlight the exact field.
        const fields: Record<string, string[]> = {};
        const formErrors: string[] = [];
        for (const issue of err.issues) {
          if (issue.path.length === 0) formErrors.push(issue.message);
          else (fields[issue.path.join(".")] ??= []).push(issue.message);
        }
        return fail(422, "VALIDATION_FAILED", formErrors[0] ?? "Please correct the highlighted fields", fields);
      }
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
        return fail(404, "NOT_FOUND", "Record not found");
      }
      console.error("[api] unhandled error", err);
      return fail(500, "INTERNAL", "Something went wrong. Please try again or call us.");
    }
  };
}

export async function readJson(request: Request): Promise<unknown> {
  const type = request.headers.get("content-type") ?? "";
  if (!type.includes("application/json")) throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "Send JSON");
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 32_000) throw new ApiError(413, "PAYLOAD_TOO_LARGE", "Request body is too large");
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "BAD_JSON", "Request body is not valid JSON");
  }
}

/** Bearer-token guard for staff endpoints. Constant-time comparison. */
export function requireAdmin(request: Request) {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) throw new ApiError(503, "ADMIN_DISABLED", "Admin API is not configured (set ADMIN_API_TOKEN)");
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new ApiError(401, "UNAUTHORIZED", "Missing or invalid admin token");
}

export function clientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || null;
}

/** Salted SHA-256 of the IP — lets us rate-limit without storing personal data. */
export function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(`${process.env.IP_HASH_SALT ?? ""}:${ip}`).digest("hex");
}

export const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
