/*
  Warnings:

  - Changed the type of `total_bill` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "total_bill",
ADD COLUMN     "total_bill" INTEGER NOT NULL;
