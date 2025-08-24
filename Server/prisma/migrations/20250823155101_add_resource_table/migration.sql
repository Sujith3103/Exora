-- DropForeignKey
ALTER TABLE "public"."LectureAsset" DROP CONSTRAINT "LectureAsset_lectureId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Resource" DROP CONSTRAINT "Resource_lectureId_fkey";

-- AlterTable
ALTER TABLE "public"."courses" ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "public"."Resource" ADD CONSTRAINT "Resource_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "public"."Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LectureAsset" ADD CONSTRAINT "LectureAsset_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "public"."Lecture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
