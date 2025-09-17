/*
  Warnings:

  - Made the column `month` on table `CouponApplication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."CouponApplication" ALTER COLUMN "month" SET NOT NULL;
