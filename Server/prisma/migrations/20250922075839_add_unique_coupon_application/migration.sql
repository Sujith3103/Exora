/*
  Warnings:

  - A unique constraint covering the columns `[couponId,month,status]` on the table `CouponApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CouponApplication_couponId_month_key";

-- CreateIndex
CREATE UNIQUE INDEX "CouponApplication_couponId_month_status_key" ON "public"."CouponApplication"("couponId", "month", "status");
