-- CreateTable
CREATE TABLE "public"."CourseRevenueHistory" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "period" TIMESTAMP(3) NOT NULL,
    "revenue" INTEGER NOT NULL DEFAULT 0,
    "enrollments" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CourseRevenueHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseRevenueHistory_courseId_key" ON "public"."CourseRevenueHistory"("courseId");

-- AddForeignKey
ALTER TABLE "public"."CourseRevenueHistory" ADD CONSTRAINT "CourseRevenueHistory_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
