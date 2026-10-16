import { createQuoteSchema } from "@/lib/validation/enquiry";
import { prisma } from "@/server/db";
import { createQuote } from "@/server/quotes";
import { ApiError, handle, isUuid, ok, readJson, requireAdmin } from "@/server/http";

type Ctx = { params: Promise<{ id: string }> };

async function enquiryId(ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) throw new ApiError(404, "NOT_FOUND", "Enquiry not found");
  return id;
}

/** Admin: all quotes issued for an enquiry, newest first. */
export const GET = handle(async (request: Request, ctx: Ctx) => {
  requireAdmin(request);
  const id = await enquiryId(ctx);
  await prisma.enquiry.findUniqueOrThrow({ where: { id }, select: { id: true } });
  const quotes = await prisma.quote.findMany({
    where: { enquiryId: id },
    orderBy: { createdAt: "desc" },
    include: { items: { orderBy: { position: "asc" } } },
  });
  return ok(quotes);
});

/** Admin: create a priced quote. Totals are always computed by the server. */
export const POST = handle(async (request: Request, ctx: Ctx) => {
  requireAdmin(request);
  const id = await enquiryId(ctx);
  const input = createQuoteSchema.parse(await readJson(request));
  return ok(await createQuote(id, input), 201);
});
