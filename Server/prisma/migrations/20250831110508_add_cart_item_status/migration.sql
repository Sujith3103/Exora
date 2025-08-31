/*
  Warnings:

  - A unique constraint covering the columns `[cartId,courseId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CartItemStatus" AS ENUM ('ACTIVE', 'SAVED_LATER', 'REMOVED');

-- AlterTable
ALTER TABLE "public"."CartItem" ADD COLUMN     "status" "public"."CartItemStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_courseId_key" ON "public"."CartItem"("cartId", "courseId");
