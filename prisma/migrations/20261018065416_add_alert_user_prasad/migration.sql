-- Add Prasad Kurada as a staff user: receives quote-request and website-chat email alerts.
INSERT INTO "users" ("id", "email", "name", "role", "updated_at")
VALUES (gen_random_uuid(), 'prasad.kurada@gmail.com', 'Prasad Kurada', 'STAFF', CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;
