/*
  Warnings:

  - Added the required column `targetId` to the `UserClick` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `UserClick` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."UserClick" DROP CONSTRAINT "UserClick_courseId_fkey";

-- DropIndex
DROP INDEX "public"."UserClick_courseId_timestamp_idx";

-- AlterTable
ALTER TABLE "public"."UserClick" ADD COLUMN     "action" TEXT NOT NULL DEFAULT 'click',
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "instructorId" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "courseId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "UserClick_targetId_timestamp_idx" ON "public"."UserClick"("targetId", "timestamp");

-- CreateIndex
CREATE INDEX "UserClick_type_targetId_idx" ON "public"."UserClick"("type", "targetId");

-- AddForeignKey
ALTER TABLE "public"."UserClick" ADD CONSTRAINT "UserClick_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
