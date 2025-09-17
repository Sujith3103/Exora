-- DropForeignKey
ALTER TABLE "public"."CouponApplication" DROP CONSTRAINT "CouponApplication_userId_fkey";

-- AlterTable
ALTER TABLE "public"."CouponApplication" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."CouponApplication" ADD CONSTRAINT "CouponApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
