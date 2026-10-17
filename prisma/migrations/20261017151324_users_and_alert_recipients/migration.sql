-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'STAFF',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notify_enquiries" BOOLEAN NOT NULL DEFAULT true,
    "notify_chats" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Initial staff who receive website alerts (quote requests and WhatsApp chats).
INSERT INTO "users" ("id", "email", "name", "role", "updated_at") VALUES
  (gen_random_uuid(), 'subramanyam549@gmail.com',   'K. Subrahmanyam',     'ADMIN', CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'kanyaka_corp@hotmail.com',   'Kanyaka Corporation', 'STAFF', CURRENT_TIMESTAMP),
  (gen_random_uuid(), 'rohithtelidevara@gmail.com', 'Rohith Telidevara',   'ADMIN', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;
