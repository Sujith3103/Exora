/*
  Warnings:

  - You are about to drop the column `image` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."courses" DROP COLUMN "image",
ADD COLUMN     "thumbnailId" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;
