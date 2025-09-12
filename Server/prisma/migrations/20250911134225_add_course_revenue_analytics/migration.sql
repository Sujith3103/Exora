/*
  Warnings:

  - You are about to alter the column `price` on the `UserPurchase` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "public"."UserPurchase" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "public"."CourseRevenueAnalytics" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "totalRevenue" INTEGER NOT NULL DEFAULT 0,
    "totalEnrolls" INTEGER NOT NULL DEFAULT 0,
    "avgPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRevenueAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseRevenueAnalytics_courseId_key" ON "public"."CourseRevenueAnalytics"("courseId");

-- AddForeignKey
ALTER TABLE "public"."CourseRevenueAnalytics" ADD CONSTRAINT "CourseRevenueAnalytics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
