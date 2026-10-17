// Shared look for every alert email the website sends (HTML + plain-text versions).
// All values passed in are escaped here, so customer-typed text can never inject markup.

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const istDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }).format(d);

export type AlertEmail = {
  /** Big title in the header, e.g. "New quote request" */
  title: string;
  /** Small line under the title, e.g. reference · time */
  subtitle: string;
  /** Bold first line of the body, e.g. "Name — Company" */
  headline: string;
  /** Secondary line under the headline */
  subline?: string;
  buttons: { href: string; label: string; color: string }[];
  rows: [string, string][];
  footer: string;
};

export function renderAlertEmail(a: AlertEmail): { html: string; text: string } {
  const button = (b: AlertEmail["buttons"][number]) =>
    `<a href="${esc(b.href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:6px;background:${b.color};color:#ffffff;font-weight:600;font-size:14px;text-decoration:none">${esc(b.label)}</a>`;

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f4ef;font-family:Segoe UI,Arial,sans-serif;color:#0b1626">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #dedcd3">
  <tr><td style="background:#071324;padding:22px 26px;color:#ffffff">
    <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#7dd8f6">Kanyaka Corporation · Website</div>
    <div style="margin-top:6px;font-size:22px;font-weight:700">${esc(a.title)}</div>
    <div style="margin-top:4px;font-size:14px;color:#cbd5e1">${esc(a.subtitle)}</div>
  </td></tr>
  <tr><td style="padding:22px 26px 6px">
    <div style="font-size:17px;font-weight:600">${esc(a.headline)}</div>
    ${a.subline ? `<div style="margin-top:4px;font-size:15px;color:#334155;white-space:pre-wrap">${esc(a.subline)}</div>` : ""}
    <div style="margin-top:16px">${a.buttons.map(button).join("")}</div>
  </td></tr>
  <tr><td style="padding:8px 26px 24px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">
      ${a.rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:9px 12px 9px 0;border-top:1px dashed #dedcd3;color:#64748b;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;border-top:1px dashed #dedcd3;font-weight:500;white-space:pre-wrap">${esc(v)}</td></tr>`,
        )
        .join("")}
    </table>
  </td></tr>
  <tr><td style="padding:14px 26px;background:#f5f4ef;font-size:12px;color:#64748b">${esc(a.footer)}</td></tr>
</table></body></html>`;

  const text = [
    `${a.title} — Kanyaka Corporation website`,
    a.subtitle,
    "",
    a.headline,
    ...(a.subline ? [a.subline] : []),
    "",
    ...a.rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...a.buttons.map((b) => `${b.label}: ${b.href}`),
    "",
    a.footer,
  ].join("\n");

  return { html, text };
}
