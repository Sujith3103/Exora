/*
  Warnings:

  - A unique constraint covering the columns `[courseId,date]` on the table `CourseRevenueHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseRevenueHistory_courseId_date_key" ON "public"."CourseRevenueHistory"("courseId", "date");
