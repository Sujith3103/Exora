/*
  Warnings:

  - Added the required column `instructorId` to the `CouponApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CouponApplication" ADD COLUMN     "instructorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CouponApplication" ADD CONSTRAINT "CouponApplication_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
