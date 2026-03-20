-- CreateEnum
CREATE TYPE "public"."DLQStatus" AS ENUM ('failed', 'success');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('notification', 'message');

-- CreateTable
CREATE TABLE "public"."DeadLetterQueue" (
    "eventId" TEXT NOT NULL,
    "eventMetaData" JSONB[],
    "retryCount" INTEGER NOT NULL,
    "failedAt" TIMESTAMP(3) NOT NULL,
    "eventType" "public"."EventType" NOT NULL,
    "error" TEXT,
    "status" "public"."DLQStatus" NOT NULL,

    CONSTRAINT "DeadLetterQueue_pkey" PRIMARY KEY ("eventId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeadLetterQueue_eventId_key" ON "public"."DeadLetterQueue"("eventId");
