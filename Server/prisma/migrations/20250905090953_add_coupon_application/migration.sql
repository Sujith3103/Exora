-- CreateEnum
CREATE TYPE "public"."DiscountType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "public"."OnlyFor" AS ENUM ('tier_1', 'tier_2', 'tier_3');

-- CreateEnum
CREATE TYPE "public"."ApplyTo" AS ENUM ('allCourses', 'oneCourseonly');

-- CreateEnum
CREATE TYPE "public"."CouponApplicationStatus" AS ENUM ('APPLIED', 'REDEEMED', 'ABANDONED');

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "public"."DiscountType" NOT NULL,
    "discount" TEXT NOT NULL,
    "noOfCoupons" INTEGER NOT NULL,
    "limitPerUser" INTEGER NOT NULL,
    "onlyFor" "public"."OnlyFor" NOT NULL,
    "autoApply" BOOLEAN NOT NULL,
    "totalRevenue" INTEGER NOT NULL,
    "applyTo" "public"."ApplyTo" NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CouponApplication" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT,
    "status" "public"."CouponApplicationStatus" NOT NULL DEFAULT 'APPLIED',

    CONSTRAINT "CouponApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "public"."Coupon"("code");

-- AddForeignKey
ALTER TABLE "public"."Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponApplication" ADD CONSTRAINT "CouponApplication_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CouponApplication" ADD CONSTRAINT "CouponApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
