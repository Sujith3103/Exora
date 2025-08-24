-- CreateTable
CREATE TABLE "public"."UserClick" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserClick_userId_timestamp_idx" ON "public"."UserClick"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "UserClick_courseId_timestamp_idx" ON "public"."UserClick"("courseId", "timestamp");

-- CreateIndex
CREATE INDEX "UserPurchase_userId_timestamp_idx" ON "public"."UserPurchase"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "UserPurchase_courseId_timestamp_idx" ON "public"."UserPurchase"("courseId", "timestamp");

-- AddForeignKey
ALTER TABLE "public"."UserClick" ADD CONSTRAINT "UserClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserClick" ADD CONSTRAINT "UserClick_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPurchase" ADD CONSTRAINT "UserPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPurchase" ADD CONSTRAINT "UserPurchase_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
