/*
  Warnings:

  - Added the required column `total_bill` to the `InstantBooking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InstantBooking" ADD COLUMN     "total_bill" INTEGER NOT NULL;
