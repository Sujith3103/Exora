/*
  Warnings:

  - You are about to drop the column `publicId` on the `Lecture` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Lecture` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."AssetType" AS ENUM ('VIDEO', 'PDF');

-- AlterTable
ALTER TABLE "public"."Lecture" DROP COLUMN "publicId",
DROP COLUMN "videoUrl",
ALTER COLUMN "lengthNum" DROP NOT NULL,
ALTER COLUMN "lengthStr" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."LectureAsset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "public"."AssetType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lectureId" TEXT NOT NULL,

    CONSTRAINT "LectureAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LectureAsset" ADD CONSTRAINT "LectureAsset_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "public"."Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
