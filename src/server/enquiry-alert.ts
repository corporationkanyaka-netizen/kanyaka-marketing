import { prisma } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { alertRecipients } from "@/server/recipients";
import { istDateTime, renderAlertEmail } from "@/server/email-layout";

// Emails every new website enquiry / quote request to the subscribed staff users.

const SOURCE_LABEL: Record<string, string> = {
  CONTACT_PAGE: "Contact page form",
  QUOTE_MODAL: "“Request a quote” pop-up",
  PRODUCT_PAGE: "Product page form",
};

export async function sendEnquiryAlert(enquiryId: string): Promise<void> {
  const e = await prisma.enquiry.findUnique({ where: { id: enquiryId }, include: { items: true } });
  if (!e) return;

  const item = e.items[0];
  const product = item?.productName ?? "—";
  const quantity = item?.quantityText ?? "—";
  const digits = e.phone.replace(/\D/g, "");
  const when = istDateTime(e.createdAt);
  const subject = `New quote request ${e.reference ?? ""} — ${product} · ${e.companyName}`.replace(/\s+/g, " ").trim();

  const { html, text } = renderAlertEmail({
    title: "New quote request",
    subtitle: `${e.reference ?? ""} · ${when} IST`,
    headline: `${e.contactName} — ${e.companyName}`,
    subline: `${product} · ${quantity} · ${e.deliveryLocation}`,
    buttons: [
      { href: `tel:${e.phone}`, label: "Call customer", color: "#071324" },
      { href: `https://wa.me/${digits}`, label: "WhatsApp customer", color: "#25D366" },
      ...(e.email
        ? [{ href: `mailto:${e.email}?subject=${encodeURIComponent(`Re: your quote request ${e.reference ?? ""}`)}`, label: "Reply by email", color: "#0284c7" }]
        : []),
    ],
    rows: [
      ["Reference", e.reference ?? "—"],
      ["Received", `${when} IST`],
      ["Name", e.contactName],
      ["Company", e.companyName],
      ["Phone / WhatsApp", e.phone],
      ["Email", e.email ?? "—"],
      ["Product", product],
      ["Quantity", quantity],
      ["Delivery location", e.deliveryLocation],
      ["Manufacturer COA", e.wantsCoa ? "Requested" : "Not requested"],
      ["Notes", e.message ?? "—"],
      ["Submitted from", (SOURCE_LABEL[e.source] ?? e.source) + (e.pageUrl ? ` (${e.pageUrl})` : "")],
    ],
    footer: `Sent automatically by the Kanyaka Corporation website. Reply to this email to answer the customer${e.email ? "" : " (no email was given — call or WhatsApp them)"}.`,
  });

  const to = await alertRecipients("enquiries");
  const result = await sendMail({ to, subject, html, text, replyTo: e.email ?? undefined });

  // Record the outcome on the enquiry's history so staff can see it.
  await prisma.activity
    .create({
      data: {
        enquiryId: e.id,
        type: "NOTE",
        actor: "system",
        note: result.ok ? `Email alert sent to ${to.join(", ")} (${result.provider})` : `Email alert NOT sent: ${result.error}`,
      },
    })
    .catch(() => {});
  if (!result.ok) console.warn("[enquiry-alert]", result.error);
}
