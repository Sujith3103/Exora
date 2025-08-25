/*
  Warnings:

  - You are about to drop the column `type` on the `UserClick` table. All the data in the column will be lost.
  - Added the required column `clickType` to the `UserClick` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserClick" DROP CONSTRAINT "UserClick_courseId_fkey";

-- DropIndex
DROP INDEX "public"."UserClick_type_targetId_idx";

-- AlterTable
ALTER TABLE "public"."UserClick" DROP COLUMN "type",
ADD COLUMN     "clickType" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."CourseAnalytics" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "trending" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseAnalytics_courseId_key" ON "public"."CourseAnalytics"("courseId");

-- CreateIndex
CREATE INDEX "UserClick_clickType_targetId_idx" ON "public"."UserClick"("clickType", "targetId");

-- AddForeignKey
ALTER TABLE "public"."CourseAnalytics" ADD CONSTRAINT "CourseAnalytics_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
