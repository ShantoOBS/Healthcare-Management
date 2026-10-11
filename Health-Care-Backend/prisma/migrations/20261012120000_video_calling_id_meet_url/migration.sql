ALTER TABLE "appointments"
ALTER COLUMN "videoCallingId" TYPE TEXT
USING "videoCallingId"::TEXT;
