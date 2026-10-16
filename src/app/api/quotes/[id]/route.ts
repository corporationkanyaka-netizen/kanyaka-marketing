import { updateQuoteSchema } from "@/lib/validation/enquiry";
import { getQuote, updateQuote } from "@/server/quotes";
import { ApiError, handle, isUuid, ok, readJson, requireAdmin } from "@/server/http";

type Ctx = { params: Promise<{ id: string }> };

async function quoteId(ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) throw new ApiError(404, "NOT_FOUND", "Quote not found");
  return id;
}

/** Admin: a quote with its lines and the enquiry it answers. */
export const GET = handle(async (request: Request, ctx: Ctx) => {
  requireAdmin(request);
  return ok(await getQuote(await quoteId(ctx)));
});

/** Admin: move a quote through DRAFT → SENT → ACCEPTED / REJECTED / EXPIRED, or CANCELLED. */
export const PATCH = handle(async (request: Request, ctx: Ctx) => {
  requireAdmin(request);
  const id = await quoteId(ctx);
  const input = updateQuoteSchema.parse(await readJson(request));
  return ok(await updateQuote(id, input));
});
