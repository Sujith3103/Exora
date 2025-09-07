/*
  Warnings:

  - The values [oneCourseonly] on the enum `ApplyTo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."ApplyTo_new" AS ENUM ('allCourses', 'oneCourse');
ALTER TABLE "public"."Coupon" ALTER COLUMN "applyTo" TYPE "public"."ApplyTo_new" USING ("applyTo"::text::"public"."ApplyTo_new");
ALTER TYPE "public"."ApplyTo" RENAME TO "ApplyTo_old";
ALTER TYPE "public"."ApplyTo_new" RENAME TO "ApplyTo";
DROP TYPE "public"."ApplyTo_old";
COMMIT;
