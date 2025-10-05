/*
  Warnings:

  - You are about to drop the column `messageRReplied` on the `ConversationParticipant` table. All the data in the column will be lost.
  - Added the required column `messageReplied` to the `ConversationParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ConversationParticipant" DROP COLUMN "messageRReplied",
ADD COLUMN     "messageReplied" BOOLEAN NOT NULL;
