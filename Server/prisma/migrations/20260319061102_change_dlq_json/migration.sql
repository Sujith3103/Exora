/*
  Warnings:

  - The `eventMetaData` column on the `DeadLetterQueue` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."DeadLetterQueue" DROP COLUMN "eventMetaData",
ADD COLUMN     "eventMetaData" JSONB;
