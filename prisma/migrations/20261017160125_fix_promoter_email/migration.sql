-- Correct the promoter's email (spelling from his business card): subrahmanyam549@gmail.com
UPDATE "users"
SET "email" = 'subrahmanyam549@gmail.com', "updated_at" = CURRENT_TIMESTAMP
WHERE "email" = 'subramanyam549@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM "users" WHERE "email" = 'subrahmanyam549@gmail.com');
