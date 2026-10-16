import { updateEnquirySchema } from "@/lib/validation/enquiry";
import { getEnquiry, updateEnquiry } from "@/server/enquiries";
import { ApiError, handle, isUuid, ok, readJson, requireAdmin } from "@/server/http";

type Ctx = { params: Promise<{ id: string }> };

async function enquiryId(ctx: Ctx) {
  const { id } = await ctx.params;
  if (!isUuid(id)) throw new ApiError(404, "NOT_FOUND", "Enquiry not found");
  return id;
}

/** Admin: full enquiry with customer, items, quotes and activity history. */
export const GET = handle(async (request: Request, ctx: Ctx) => {
  requireAdmin(request);
  return ok(await getEnquiry(await enquiryId(ctx)));
});

/** Admin: change status and/or add a note. Body: { status?, note?, actor? } */
export const PATCH = handle(async (request: Request, ctx: Ctx) => {
  requireAdmin(request);
  const id = await enquiryId(ctx);
  const input = updateEnquirySchema.parse(await readJson(request));
  return ok(await updateEnquiry(id, input));
});
