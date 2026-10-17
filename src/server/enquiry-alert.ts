import { prisma } from "@/server/db";
import { sendMail } from "@/server/mailer";
import { alertRecipients } from "@/server/recipients";
import { istDateTime, prettyPhone, renderAlertEmail, type ProductTile } from "@/server/email-layout";
import { companyInfo } from "@/data/company";
import { productsData } from "@/data/products";
import { tileSymbol } from "@/lib/chem";

// For every new website enquiry: email the subscribed staff, and (if the customer gave an email)
// send the customer a confirmation. Both outcomes are written to the enquiry's history.

const SOURCE_LABEL: Record<string, string> = {
  CONTACT_PAGE: "Contact page form",
  QUOTE_MODAL: "“Request a quote” pop-up",
  PRODUCT_PAGE: "Product page form",
};

async function logNote(enquiryId: string, note: string) {
  await prisma.activity.create({ data: { enquiryId, type: "NOTE", actor: "system", note } }).catch(() => {});
}

/** Catalogue facts for the element-style product card (null for "other chemical"). */
function productTile(slug: string | null | undefined): ProductTile | undefined {
  const p = slug ? productsData.find((x) => x.slug === slug) : undefined;
  if (!p) return undefined;
  return { symbol: tileSymbol(p), name: p.name, purity: p.purity, make: p.manufacturer, packing: p.packagingOptions[0], cas: p.casNumber };
}

export async function sendEnquiryAlert(enquiryId: string): Promise<void> {
  const e = await prisma.enquiry.findUnique({ where: { id: enquiryId }, include: { items: true } });
  if (!e) return;

  const item = e.items[0];
  const product = item?.productName ?? "—";
  const quantity = item?.quantityText ?? "—";
  const tile = productTile(item?.productSlug);
  const phone = prettyPhone(e.phone);
  const digits = e.phone.replace(/\D/g, "");
  const when = istDateTime(e.createdAt);
  const ref = e.reference ?? "";
  const c = companyInfo.contacts;

  // ── 1. Team alert ─────────────────────────────────────────────────────
  const team = renderAlertEmail({
    label: "New quote request",
    tone: "brand",
    title: product,
    subtitle: `${ref} · ${when} IST`,
    preheader: `${e.contactName} (${e.companyName}) wants ${quantity} of ${product}, delivered to ${e.deliveryLocation}.`,
    person: { name: e.contactName, company: e.companyName, contact: [phone, e.email].filter(Boolean).join("  ·  ") },
    intro: e.message ? `“${e.message}”` : undefined,
    product: tile,
    highlights: [
      ["Quantity", quantity],
      ["Deliver to", e.deliveryLocation],
      ["Manufacturer COA", e.wantsCoa ? "Requested" : "Not needed"],
    ],
    buttons: [
      { href: `tel:${e.phone}`, label: "📞  Call customer", color: "#071324" },
      { href: `https://wa.me/${digits}`, label: "💬  WhatsApp", color: "#16a34a" },
      ...(e.email ? [{ href: `mailto:${e.email}?subject=${encodeURIComponent(`Re: your enquiry ${ref}`)}`, label: "✉️  Reply by email", color: "#0284c7" }] : []),
    ],
    detailsTitle: "Enquiry details",
    rows: [
      ["Reference", ref || "—"],
      ["Received", `${when} IST`],
      ["Name", e.contactName],
      ["Company", e.companyName],
      ["Phone", phone],
      ["Email", e.email ?? "Not given"],
      ["Submitted from", SOURCE_LABEL[e.source] ?? e.source],
    ],
    note: e.email
      ? "Tip: just hit Reply — your answer goes straight to the customer. They've already received a confirmation from us."
      : "The customer didn't give an email address — please call or WhatsApp them.",
  });

  const to = await alertRecipients("enquiries");
  const result = await sendMail({
    to,
    subject: `🧪 New quote request ${ref} — ${product} · ${e.companyName}`.replace(/\s+/g, " ").trim(),
    html: team.html,
    text: team.text,
    replyTo: e.email ?? undefined,
  });
  await logNote(e.id, result.ok ? `Email alert sent to ${to.join(", ")} (${result.provider})` : `Email alert NOT sent: ${result.error}`);
  if (!result.ok) console.warn("[enquiry-alert]", result.error);

  // ── 2. Customer confirmation ──────────────────────────────────────────
  if (!e.email) return;
  const confirm = renderAlertEmail({
    label: "Enquiry received",
    tone: "green",
    title: "Thank you for your enquiry",
    subtitle: `Reference ${ref} · ${when} IST`,
    preheader: `We've received your enquiry for ${product}. Our sales team will contact you shortly with the price.`,
    headline: `Dear ${e.contactName},`,
    intro: `Thank you for choosing ${companyInfo.name}. Your enquiry has reached our sales team, and we'll get back to you shortly with the price and availability.`,
    product: tile,
    highlights: [
      ["Quantity", quantity],
      ["Deliver to", e.deliveryLocation],
      ["Manufacturer COA", e.wantsCoa ? "Requested" : "Not needed"],
    ],
    steps: [
      { title: "Received", caption: "Your enquiry is with us", done: true },
      { title: "Team reviewing", caption: "Checking stock & best price" },
      { title: "Price shared", caption: "We call or email you" },
    ],
    buttons: [{ href: `tel:${c.phonePrimary.replace(/\s+/g, "")}`, label: `📞  Call ${c.phonePrimary}`, color: "#071324" }],
    detailsTitle: "Your request",
    rows: [
      ["Reference", ref || "—"],
      ["Company", e.companyName],
      ["Phone", phone],
      ["Your notes", e.message ?? "—"],
    ],
    note: `Please quote reference ${ref} in any correspondence. Simply reply to this email to reach our sales team.`,
  });
  const sent = await sendMail({
    to: [e.email],
    subject: `✅ We've received your enquiry ${ref} — ${companyInfo.name}`.replace(/\s+/g, " ").trim(),
    html: confirm.html,
    text: confirm.text,
    replyTo: c.emailSales,
  });
  await logNote(e.id, sent.ok ? `Confirmation email sent to customer (${e.email})` : `Customer confirmation NOT sent: ${sent.error}`);
}
