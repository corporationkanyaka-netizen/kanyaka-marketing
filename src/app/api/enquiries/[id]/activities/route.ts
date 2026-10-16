import { logActivitySchema } from "@/lib/validation/enquiry";
import { logActivity } from "@/server/enquiries";
import { ApiError, handle, isUuid, ok, readJson, requireAdmin } from "@/server/http";

/** Admin: log a note, call, WhatsApp or email against an enquiry. Body: { type, note, actor? } */
export const POST = handle(async (request: Request, ctx: { params: Promise<{ id: string }> }) => {
  requireAdmin(request);
  const { id } = await ctx.params;
  if (!isUuid(id)) throw new ApiError(404, "NOT_FOUND", "Enquiry not found");
  const input = logActivitySchema.parse(await readJson(request));
  return ok(await logActivity(id, input), 201);
});
