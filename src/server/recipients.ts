import { prisma } from "@/server/db";
import { companyInfo } from "@/data/company";

export type AlertKind = "enquiries" | "chats";

/**
 * Who receives an alert email:
 *   1. QUOTE_ALERT_TO env (comma-separated) — an explicit override, e.g. for testing
 *   2. otherwise every active user subscribed to that kind of alert (the `users` table)
 *   3. if nobody is subscribed, the two company addresses — so alerts never go nowhere
 */
export async function alertRecipients(kind: AlertKind): Promise<string[]> {
  const override = process.env.QUOTE_ALERT_TO?.split(",").map((s) => s.trim()).filter(Boolean);
  if (override?.length) return override;

  const users = await prisma.user.findMany({
    where: { active: true, ...(kind === "enquiries" ? { notifyEnquiries: true } : { notifyChats: true }) },
    select: { email: true },
    orderBy: { createdAt: "asc" },
  });
  if (users.length) return users.map((u) => u.email);

  return [companyInfo.contacts.emailDirector, companyInfo.contacts.emailSales];
}
