import { prisma } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { alertRecipients } from "@/server/recipients";
import { istDateTime, renderAlertEmail } from "@/server/email-layout";

// Emails every new website WhatsApp-chat message to the subscribed staff users,
// so it's seen even if WhatsApp delivery (UltraMsg) is down.

export async function sendChatAlert(messageId: string): Promise<void> {
  const m = await prisma.whatsAppMessage.findUnique({ where: { id: messageId } });
  if (!m) return;

  const digits = m.phone.replace(/\D/g, "");
  const when = istDateTime(m.createdAt);
  const who = m.company ? `${m.name} (${m.company})` : m.name;
  const delivery =
    m.status === "SENT" ? "Delivered to the sales WhatsApp" : m.status === "FAILED" ? `Not delivered to WhatsApp — ${m.error ?? "unknown error"}` : "Pending";

  const { html, text } = renderAlertEmail({
    title: "New WhatsApp chat message",
    subtitle: `${when} IST`,
    headline: who,
    subline: m.message,
    buttons: [
      { href: `https://wa.me/${digits}`, label: "Reply on WhatsApp", color: "#25D366" },
      { href: `tel:${m.phone}`, label: "Call", color: "#071324" },
      ...(m.email ? [{ href: `mailto:${m.email}`, label: "Reply by email", color: "#0284c7" }] : []),
    ],
    rows: [
      ["Received", `${when} IST`],
      ["Name", m.name],
      ["Company", m.company ?? "—"],
      ["WhatsApp", m.phone],
      ["Email", m.email ?? "—"],
      ["Message", m.message],
      ["Page", m.pageUrl ?? "—"],
      ["WhatsApp delivery", delivery],
    ],
    footer: "Sent automatically by the Kanyaka Corporation website chat.",
  });

  const to = await alertRecipients("chats");
  const result = await sendMail({
    to,
    subject: `New WhatsApp chat — ${who}`,
    html,
    text,
    replyTo: m.email ?? undefined,
  });
  if (!result.ok) console.warn("[chat-alert]", result.error);
}
