-- CreateTable
CREATE TABLE "public"."UserLectureProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lectureId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "watchedSec" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLectureProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CourseProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserLectureProgress_userId_courseId_idx" ON "public"."UserLectureProgress"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "UserLectureProgress_userId_lectureId_key" ON "public"."UserLectureProgress"("userId", "lectureId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseProgress_userId_courseId_key" ON "public"."CourseProgress"("userId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."UserLectureProgress" ADD CONSTRAINT "UserLectureProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLectureProgress" ADD CONSTRAINT "UserLectureProgress_lectureId_fkey" FOREIGN KEY ("lectureId") REFERENCES "public"."Lecture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
