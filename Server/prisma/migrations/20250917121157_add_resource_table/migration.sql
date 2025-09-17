/*
  Warnings:

  - A unique constraint covering the columns `[couponId,month]` on the table `CouponApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CouponApplication_couponId_month_key" ON "public"."CouponApplication"("couponId", "month");
