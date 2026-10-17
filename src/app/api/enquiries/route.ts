import { after } from "next/server";
import { createEnquirySchema, listEnquiriesQuerySchema } from "@/lib/validation/enquiry";
import { sendEnquiryAlert } from "@/server/enquiry-alert";
import { createEnquiry, listEnquiries } from "@/server/enquiries";
import { clientIp, handle, hashIp, ok, readJson, requireAdmin } from "@/server/http";

/** Public: submit an enquiry from the website forms. */
export const POST = handle(async (request: Request) => {
  const input = createEnquirySchema.parse(await readJson(request));

  // Honeypot filled → a bot. Pretend success so it doesn't retry, but store nothing.
  if (input.website) return ok({ id: null, reference: null, createdAt: new Date() }, 201);

  const { enquiry, created } = await createEnquiry(input, {
    ipHash: hashIp(clientIp(request)),
    userAgent: request.headers.get("user-agent"),
  });
  // Email the sales team once the customer already has their confirmation (retries don't re-send).
  if (created && enquiry.id) after(() => sendEnquiryAlert(enquiry.id));

  return ok(enquiry, created ? 201 : 200);
});

/** Admin: list / search / filter enquiries. ?status=&source=&q=&from=YYYY-MM-DD&to=&page=&pageSize= */
export const GET = handle(async (request: Request) => {
  requireAdmin(request);
  const query = listEnquiriesQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
  return ok(await listEnquiries(query));
});
