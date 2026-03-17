/*
  Warnings:

  - You are about to drop the column `projectId` on the `message` table. All the data in the column will be lost.
  - You are about to drop the column `phase` on the `project` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_projectId_fkey";

-- DropIndex
DROP INDEX "message_projectId_createdAt_idx";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "projectId",
ADD COLUMN     "conversationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "project" DROP COLUMN "phase",
ALTER COLUMN "title" SET DEFAULT '新项目';

-- CreateTable
CREATE TABLE "conversation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '新对话',
    "phase" TEXT NOT NULL DEFAULT 'CHAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "conversation_projectId_updatedAt_idx" ON "conversation"("projectId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "message_conversationId_createdAt_idx" ON "message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
