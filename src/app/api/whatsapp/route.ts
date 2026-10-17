import { after } from "next/server";
import { whatsappMessageSchema } from "@/lib/validation/enquiry";
import { sendChatAlert } from "@/server/chat-alert";
import { clientIp, handle, hashIp, ok, readJson } from "@/server/http";
import { submitWhatsAppMessage } from "@/server/whatsapp";

/**
 * Public: a message from the website chat widget.
 * Always stored; `delivered` says whether it reached the sales WhatsApp via UltraMsg.
 * When false, the widget offers the visitor a wa.me link instead.
 */
export const POST = handle(async (request: Request) => {
  const input = whatsappMessageSchema.parse(await readJson(request));
  if (input.website) return ok({ id: null, delivered: true }, 201); // honeypot: bot

  const result = await submitWhatsAppMessage(input, { ipHash: hashIp(clientIp(request)) });

  // Email the subscribed staff after the visitor has their answer.
  after(() => sendChatAlert(result.id));

  return ok(result, 201);
});
