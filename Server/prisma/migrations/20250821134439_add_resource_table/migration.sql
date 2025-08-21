/*
  Warnings:

  - You are about to drop the column `profilebanner` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profilebannerId` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileimg` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profileimgId` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."UserProfile" DROP COLUMN "profilebanner",
DROP COLUMN "profilebannerId",
DROP COLUMN "profileimg",
DROP COLUMN "profileimgId",
ADD COLUMN     "profileBanner" TEXT,
ADD COLUMN     "profileBannerId" TEXT,
ADD COLUMN     "profileImg" TEXT,
ADD COLUMN     "profileImgId" TEXT;
