/*
  Warnings:

  - A unique constraint covering the columns `[userId,isDefault]` on the table `Board` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Board` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoardType" AS ENUM ('PERSONAL', 'ROOM');

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "type" "BoardType" NOT NULL,
ALTER COLUMN "elements" SET DEFAULT '[]';

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "name" SET DEFAULT 'Room';

-- CreateIndex
CREATE INDEX "Board_userId_idx" ON "Board"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Board_userId_isDefault_key" ON "Board"("userId", "isDefault");
