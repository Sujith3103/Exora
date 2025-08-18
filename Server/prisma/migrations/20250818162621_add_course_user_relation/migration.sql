-- CreateEnum
CREATE TYPE "public"."CourseStatus" AS ENUM ('published', 'drafted');

-- CreateTable
CREATE TABLE "public"."courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "primaryLanguage" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pricing" DOUBLE PRECISION NOT NULL,
    "objectives" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "searchkey" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lengthNum" INTEGER NOT NULL,
    "lengthStr" TEXT NOT NULL,
    "status" "public"."CourseStatus" NOT NULL,
    "instructorId" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "public"."courses"("slug");

-- AddForeignKey
ALTER TABLE "public"."courses" ADD CONSTRAINT "courses_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
