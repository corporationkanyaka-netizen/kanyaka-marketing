-- CreateEnum
CREATE TYPE "WhatsAppMessageStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "whatsapp_messages" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "message" VARCHAR(1000) NOT NULL,
    "page_url" VARCHAR(500),
    "status" "WhatsAppMessageStatus" NOT NULL DEFAULT 'PENDING',
    "provider_id" VARCHAR(64),
    "error" VARCHAR(300),
    "ip_hash" CHAR(64),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMPTZ(3),

    CONSTRAINT "whatsapp_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "whatsapp_messages_created_at_idx" ON "whatsapp_messages"("created_at" DESC);

-- CreateIndex
CREATE INDEX "whatsapp_messages_ip_hash_created_at_idx" ON "whatsapp_messages"("ip_hash", "created_at");

-- CreateIndex
CREATE INDEX "whatsapp_messages_status_idx" ON "whatsapp_messages"("status");
