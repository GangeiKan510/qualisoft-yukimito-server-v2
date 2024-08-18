/*
  Warnings:

  - You are about to drop the column `type` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `address` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pet_owner_name` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "type",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "pet_owner_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT NOT NULL,
ADD COLUMN     "service" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN     "bookingId" TEXT;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
