import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// One client per process. In dev, hot reloads re-evaluate modules, so cache it on globalThis
// to avoid opening a new connection pool on every edit — but rebuild it if DATABASE_URL
// changes (e.g. after editing .env.development), so the dev server never talks to a stale database.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; prismaUrl?: string };

function createClient(connectionString: string) {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

function getClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set. Copy .env.development.example to .env.development and configure it.");

  if (!globalForPrisma.prisma || globalForPrisma.prismaUrl !== url) {
    void globalForPrisma.prisma?.$disconnect();
    globalForPrisma.prisma = createClient(url);
    globalForPrisma.prismaUrl = url;
  }
  return globalForPrisma.prisma;
}

/** Lazily resolves the current client, so a changed DATABASE_URL takes effect on the next query. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
