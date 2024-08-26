/*
  Warnings:

  - Added the required column `total_bill` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "total_bill" TEXT NOT NULL;
