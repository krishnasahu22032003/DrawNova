/*
  Warnings:

  - Made the column `title` on table `Board` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Board_userId_isDefault_key";

-- AlterTable
ALTER TABLE "Board" ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "name" SET NOT NULL;
