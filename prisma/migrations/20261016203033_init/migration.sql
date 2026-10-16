-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST', 'SPAM');

-- CreateEnum
CREATE TYPE "EnquirySource" AS ENUM ('CONTACT_PAGE', 'QUOTE_MODAL', 'PRODUCT_PAGE', 'PHONE', 'WHATSAPP', 'EMAIL', 'WALK_IN', 'OTHER');

-- CreateEnum
CREATE TYPE "QuantityUnit" AS ENUM ('KG', 'MT', 'BAGS', 'DRUMS', 'CARBOYS', 'LITRES', 'KL', 'TANKERS', 'OTHER');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CREATED', 'STATUS_CHANGED', 'NOTE', 'CALL', 'WHATSAPP', 'EMAIL', 'QUOTE_CREATED', 'QUOTE_STATUS_CHANGED');

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254),
    "gstin" VARCHAR(15),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiries" (
    "id" UUID NOT NULL,
    "seq" SERIAL NOT NULL,
    "reference" VARCHAR(24),
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "source" "EnquirySource" NOT NULL,
    "customer_id" UUID NOT NULL,
    "contact_name" VARCHAR(100) NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(254),
    "delivery_location" VARCHAR(200) NOT NULL,
    "message" VARCHAR(2000),
    "wants_coa" BOOLEAN NOT NULL DEFAULT false,
    "idempotency_key" UUID,
    "page_url" VARCHAR(500),
    "ip_hash" CHAR(64),
    "user_agent" VARCHAR(300),
    "responded_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiry_items" (
    "id" UUID NOT NULL,
    "enquiry_id" UUID NOT NULL,
    "product_slug" VARCHAR(80),
    "product_name" VARCHAR(150) NOT NULL,
    "quantity_text" VARCHAR(100) NOT NULL,
    "quantity" DECIMAL(14,3),
    "unit" "QuantityUnit",
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "seq" SERIAL NOT NULL,
    "quote_number" VARCHAR(24),
    "enquiry_id" UUID NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "valid_until" DATE,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "tax_total" DECIMAL(14,2) NOT NULL,
    "freight" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "payment_terms" VARCHAR(300),
    "delivery_terms" VARCHAR(300),
    "notes" VARCHAR(2000),
    "created_by" VARCHAR(80),
    "sent_at" TIMESTAMPTZ(3),
    "decided_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" UUID NOT NULL,
    "quote_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL,
    "product_slug" VARCHAR(80),
    "description" VARCHAR(200) NOT NULL,
    "quantity" DECIMAL(14,3) NOT NULL,
    "unit" "QuantityUnit" NOT NULL,
    "unit_price" DECIMAL(14,2) NOT NULL,
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 18,
    "line_subtotal" DECIMAL(14,2) NOT NULL,
    "line_tax" DECIMAL(14,2) NOT NULL,
    "line_total" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" UUID NOT NULL,
    "enquiry_id" UUID NOT NULL,
    "quote_id" UUID,
    "type" "ActivityType" NOT NULL,
    "from_status" VARCHAR(20),
    "to_status" VARCHAR(20),
    "note" VARCHAR(2000),
    "actor" VARCHAR(80),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_phone_key" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "customers_company_name_idx" ON "customers"("company_name");

-- CreateIndex
CREATE UNIQUE INDEX "enquiries_seq_key" ON "enquiries"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "enquiries_reference_key" ON "enquiries"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "enquiries_idempotency_key_key" ON "enquiries"("idempotency_key");

-- CreateIndex
CREATE INDEX "enquiries_status_created_at_idx" ON "enquiries"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "enquiries_created_at_idx" ON "enquiries"("created_at" DESC);

-- CreateIndex
CREATE INDEX "enquiries_customer_id_idx" ON "enquiries"("customer_id");

-- CreateIndex
CREATE INDEX "enquiries_ip_hash_created_at_idx" ON "enquiries"("ip_hash", "created_at");

-- CreateIndex
CREATE INDEX "enquiry_items_enquiry_id_idx" ON "enquiry_items"("enquiry_id");

-- CreateIndex
CREATE INDEX "enquiry_items_product_slug_idx" ON "enquiry_items"("product_slug");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_seq_key" ON "quotes"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_quote_number_key" ON "quotes"("quote_number");

-- CreateIndex
CREATE INDEX "quotes_enquiry_id_idx" ON "quotes"("enquiry_id");

-- CreateIndex
CREATE INDEX "quotes_status_created_at_idx" ON "quotes"("status", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "quote_items_quote_id_position_key" ON "quote_items"("quote_id", "position");

-- CreateIndex
CREATE INDEX "activities_enquiry_id_created_at_idx" ON "activities"("enquiry_id", "created_at");

-- CreateIndex
CREATE INDEX "activities_quote_id_idx" ON "activities"("quote_id");

-- AddForeignKey
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enquiry_items" ADD CONSTRAINT "enquiry_items_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
