/*
  Warnings:

  - A unique constraint covering the columns `[lectureId]` on the table `LectureAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LectureAsset_lectureId_key" ON "public"."LectureAsset"("lectureId");
