/*
  Warnings:

  - You are about to drop the column `avgPrice` on the `CourseRevenueAnalytics` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `CourseRevenueHistory` table. All the data in the column will be lost.
  - Added the required column `instructorId` to the `CourseRevenueAnalytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `CourseRevenueHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instructorId` to the `CourseRevenueHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CourseRevenueAnalytics" DROP COLUMN "avgPrice",
ADD COLUMN     "instructorId" TEXT NOT NULL,
ADD COLUMN     "totalDiscountedRevenue" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."CourseRevenueHistory" DROP COLUMN "period",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dicountedRevenue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "instructorId" TEXT NOT NULL;
