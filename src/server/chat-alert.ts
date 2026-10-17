import { prisma } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { alertRecipients } from "@/server/recipients";
import { istDateTime, prettyPhone, renderAlertEmail } from "@/server/email-layout";

// Emails every new website chat message to the subscribed staff users,
// so it's seen even if WhatsApp delivery (UltraMsg) is down.

export async function sendChatAlert(messageId: string): Promise<void> {
  const m = await prisma.whatsAppMessage.findUnique({ where: { id: messageId } });
  if (!m) return;

  const phone = prettyPhone(m.phone);
  const digits = m.phone.replace(/\D/g, "");
  const when = istDateTime(m.createdAt);
  const who = m.company ? `${m.name} · ${m.company}` : m.name;
  const delivery =
    m.status === "SENT" ? "Also delivered to the sales WhatsApp" : m.status === "FAILED" ? `Not delivered to WhatsApp (${m.error ?? "unknown error"})` : "Pending";

  const { html, text } = renderAlertEmail({
    label: "New chat message",
    tone: "amber",
    title: "Message from the website",
    subtitle: `${when} IST`,
    preheader: `${who}: ${m.message.slice(0, 120)}`,
    person: { name: m.name, company: m.company ?? undefined, contact: [phone, m.email].filter(Boolean).join("  ·  ") },
    intro: `“${m.message}”`,
    buttons: [
      { href: `https://wa.me/${digits}`, label: "💬  Reply on WhatsApp", color: "#16a34a" },
      { href: `tel:${m.phone}`, label: "📞  Call", color: "#071324" },
      ...(m.email ? [{ href: `mailto:${m.email}`, label: "✉️  Reply by email", color: "#0284c7" }] : []),
    ],
    detailsTitle: "Contact details",
    rows: [
      ["Name", m.name],
      ["Company", m.company ?? "Not given"],
      ["WhatsApp", phone],
      ["Email", m.email ?? "Not given"],
      ["Page", m.pageUrl ?? "—"],
      ["WhatsApp delivery", delivery],
    ],
  });

  const to = await alertRecipients("chats");
  const result = await sendMail({ to, subject: `💬 New website chat — ${who}`, html, text, replyTo: m.email ?? undefined });
  if (!result.ok) console.warn("[chat-alert]", result.error);
}
