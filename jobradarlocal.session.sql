ALTER TABLE "User" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Asia/Ho_Chi_Minh';

CREATE TABLE "PasswordResetToken" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

ALTER TABLE "PasswordResetToken"
    ADD CONSTRAINT "PasswordResetToken_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

    CREATE INDEX IF NOT EXISTS "JobApplication_userId_appliedAt_idx"
  ON "JobApplication" ("userId", "appliedAt" DESC);

  CREATE INDEX IF NOT EXISTS "JobApplication_userId_status_idx"
  ON "JobApplication" ("userId", "status");

  CREATE INDEX IF NOT EXISTS "InterviewNote_jobId_idx"
  ON "InterviewNote" ("jobId");

  CREATE INDEX IF NOT EXISTS "InterviewNote_userId_idx"
  ON "InterviewNote" ("userId");

  CREATE INDEX IF NOT EXISTS "RefreshToken_userId_idx"
  ON "RefreshToken" ("userId");

  ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "emailVerifyTokenHash" TEXT,
  ADD COLUMN IF NOT EXISTS "emailVerifyExpiresAt" TIMESTAMP(3);

  CREATE INDEX IF NOT EXISTS "JobApplication_deadlineAt_idx"
  ON "JobApplication" ("deadlineAt");