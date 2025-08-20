-- CreateEnum
CREATE TYPE "public"."LectureAssetStatus" AS ENUM ('published', 'pending');

-- AlterTable
ALTER TABLE "public"."LectureAsset" ADD COLUMN     "status" "public"."LectureAssetStatus" NOT NULL DEFAULT 'pending';
