-- CreateEnum
CREATE TYPE "EmailDirection" AS ENUM ('OUTBOUND', 'INBOUND');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('OPENING', 'PURCHASE', 'SALE', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN', 'ADJUSTMENT');

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "notes" VARCHAR(2000);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_login_at" TIMESTAMPTZ(3);

-- CreateTable
CREATE TABLE "login_tokens" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "used_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" CHAR(64) NOT NULL,
    "user_agent" VARCHAR(300),
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "last_seen_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_messages" (
    "id" UUID NOT NULL,
    "direction" "EmailDirection" NOT NULL,
    "enquiry_id" UUID,
    "customer_id" UUID,
    "quote_id" UUID,
    "from_email" VARCHAR(254) NOT NULL,
    "to_email" VARCHAR(254) NOT NULL,
    "subject" VARCHAR(300) NOT NULL,
    "body" TEXT NOT NULL,
    "message_id" VARCHAR(300),
    "ok" BOOLEAN NOT NULL DEFAULT true,
    "error" VARCHAR(300),
    "sent_by" VARCHAR(100),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "make" VARCHAR(150) NOT NULL,
    "category" VARCHAR(60) NOT NULL,
    "packing" VARCHAR(60) NOT NULL,
    "pack_kg" DECIMAL(10,3),
    "hsn_code" VARCHAR(10),
    "gst_rate" DECIMAL(5,2) NOT NULL DEFAULT 18,
    "reorder_level_kg" DECIMAL(14,3) NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" VARCHAR(300),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity_kg" DECIMAL(14,3) NOT NULL,
    "rate_per_kg" DECIMAL(12,4),
    "party" VARCHAR(150),
    "customer_id" UUID,
    "enquiry_id" UUID,
    "reference" VARCHAR(100),
    "note" VARCHAR(500),
    "transfer_id" UUID,
    "occurred_on" DATE NOT NULL,
    "actor" VARCHAR(100),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_tokens_token_hash_key" ON "login_tokens"("token_hash");

-- CreateIndex
CREATE INDEX "login_tokens_user_id_created_at_idx" ON "login_tokens"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "staff_sessions_token_hash_key" ON "staff_sessions"("token_hash");

-- CreateIndex
CREATE INDEX "staff_sessions_user_id_idx" ON "staff_sessions"("user_id");

-- CreateIndex
CREATE INDEX "email_messages_enquiry_id_created_at_idx" ON "email_messages"("enquiry_id", "created_at");

-- CreateIndex
CREATE INDEX "email_messages_customer_id_created_at_idx" ON "email_messages"("customer_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_code_key" ON "warehouses"("code");

-- CreateIndex
CREATE INDEX "stock_movements_product_id_warehouse_id_idx" ON "stock_movements"("product_id", "warehouse_id");

-- CreateIndex
CREATE INDEX "stock_movements_occurred_on_idx" ON "stock_movements"("occurred_on" DESC);

-- CreateIndex
CREATE INDEX "stock_movements_customer_id_idx" ON "stock_movements"("customer_id");

-- AddForeignKey
ALTER TABLE "login_tokens" ADD CONSTRAINT "login_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_sessions" ADD CONSTRAINT "staff_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_enquiry_id_fkey" FOREIGN KEY ("enquiry_id") REFERENCES "enquiries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ── Seed: warehouses ─────────────────────────────────────────────────
INSERT INTO "warehouses" ("id","code","name","address") VALUES
  (gen_random_uuid(),'PSM','Pashamylaram warehouse','Near Pashamylaram Industrial Estate, Sangareddy, Telangana'),
  (gen_random_uuid(),'KNK','Kanukunta warehouse','Kanukunta, north of Hyderabad, Telangana')
ON CONFLICT ("code") DO NOTHING;

-- ── Seed: the 27 products on the official product list ───────────────
INSERT INTO "products" ("id","slug","name","make","category","packing","pack_kg","sort_order","updated_at") VALUES
  (gen_random_uuid(),'aluminium-chloride-granules','Aluminium Chloride Granules','Grasim','Chlor-Alkali','25 Kg',25,1,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'aluminium-chloride-powder','Aluminium Chloride Powder','Grasim','Chlor-Alkali','25 Kg',25,2,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'ammonium-chloride','Ammonium Chloride','Shalibadra SP Chem','Inorganic Salts','25 Kg',25,3,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'calcium-chloride-granules','Calcium Chloride Granules (94%)','Grasim','Chlor-Alkali','50 Kg',50,4,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'calcium-chloride-powder','Calcium Chloride Powder (94%)','Kutch / Panoli Aqua','Chlor-Alkali','50 Kg',50,5,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'calcium-chloride-lumps','Calcium Chloride Lumps (70–75%)','Grasim / Panoli Aqua','Chlor-Alkali','50 Kg',50,6,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'caustic-soda-flakes','Caustic Soda Flakes','DCM / Grasim / TGV','Chlor-Alkali','50 Kg',50,7,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'caustic-potash-flakes','Caustic Potash Flakes','Andhra Sugars / TGV','Alkalis & Carbonates','50 Kg',50,8,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'ferrous-sulphate','Ferrous Sulphate','Vinipul Chemicals','Inorganic Salts','50 Kg',50,9,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'hydrochloric-acid','Hydrochloric Acid (HCl)','Grasim / TGV / Andhra Sugars','Acids & Reagents','Carboy / Drum / Tanker',NULL,10,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'hyflow','Hyflow (Filter Aid)','Amol Mine Chem','Acids & Reagents','20 Kg',20,11,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'potassium-carbonate','Potassium Carbonate Powder','Andhra Sugars / TGV','Alkalis & Carbonates','50 Kg',50,12,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'soda-ash-light','Soda Ash Light','Nirma / Tata','Alkalis & Carbonates','50 Kg',50,13,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-bicarbonate','Sodium Bicarbonate','Nirma / Tata','Alkalis & Carbonates','50 Kg',50,14,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-bicarbonate-refined','Sodium Bicarbonate (Refined)','Tata','Alkalis & Carbonates','50 Kg',50,15,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-sulphate-anhydrous','Sodium Sulphate Anhydrous','Deepak / Grasim','Inorganic Salts','50 Kg',50,16,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-metabisulphite','Sodium Meta Bi Sulphite (SMBS)','Shree Krishna / Shalin','Inorganic Salts','50 Kg',50,17,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-bisulphite','Sodium Bi Sulphite (SBS)','Shree Krishna / Shalin','Inorganic Salts','50 Kg',50,18,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-sulphite','Sodium Sulphite','Shree Krishna','Inorganic Salts','50 Kg',50,19,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-thiosulphate','Sodium Thio Sulphate (STS)','Shalibadra Chem / Shalibadra Dye Chem','Inorganic Salts','50 Kg',50,20,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-nitrite','Sodium Nitrite','Kutch','Inorganic Salts','50 Kg',50,21,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-acetate','Sodium Acetate','Omkar Pharma','Inorganic Salts','25 Kg',25,22,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-chloride','Sodium Chloride','Terapanth / Ankur / Sungold','Inorganic Salts','50 Kg',50,23,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sodium-hypochlorite','Sodium Hypochlorite','Grasim / Andhra Sugars','Chlor-Alkali','Tanker',NULL,24,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'sulphuric-acid','Sulphuric Acid','SRHH / Andhra Sugars','Acids & Reagents','Tanker',NULL,25,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'thionyl-chloride','Thionyl Chloride','Panoli / Kutch','Acids & Reagents','300 Kg Drum',300,26,CURRENT_TIMESTAMP),
  (gen_random_uuid(),'oxalic-acid','Oxalic Acid','Radiant Agro','Acids & Reagents','50 Kg',50,27,CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;
