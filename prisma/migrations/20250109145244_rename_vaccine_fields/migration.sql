/*
  Warnings:

  - You are about to drop the column `batchNumber` on the `Vaccine` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Vaccine` table. All the data in the column will be lost.
  - You are about to drop the column `dateAdministered` on the `Vaccine` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Vaccine` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vaccine` table. All the data in the column will be lost.
  - Added the required column `batch_number` to the `Vaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_administered` to the `Vaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry_date` to the `Vaccine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Vaccine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vaccine" DROP COLUMN "batchNumber",
DROP COLUMN "createdAt",
DROP COLUMN "dateAdministered",
DROP COLUMN "expiryDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "batch_number" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date_administered" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
