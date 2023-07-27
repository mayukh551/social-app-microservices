/*
  Warnings:

  - You are about to alter the column `followers` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `following` on the `User` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "followers" SET DATA TYPE INTEGER,
ALTER COLUMN "following" SET DATA TYPE INTEGER;
