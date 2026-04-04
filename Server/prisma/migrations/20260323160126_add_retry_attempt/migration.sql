-- CreateEnum
CREATE TYPE "public"."AttemptType" AS ENUM ('AUTO', 'FINAL', 'MANUAL');

-- CreateEnum
CREATE TYPE "public"."AttemptStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "public"."RetryAttempt" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "attemptType" "public"."AttemptType" NOT NULL,
    "attemptNo" INTEGER NOT NULL,
    "status" "public"."AttemptStatus" NOT NULL,
    "error" TEXT,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "RetryAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."RetryAttempt" ADD CONSTRAINT "RetryAttempt_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."DeadLetterQueue"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;
