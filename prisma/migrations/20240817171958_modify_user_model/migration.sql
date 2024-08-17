/*
  Warnings:

  - You are about to drop the column `birth_date` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `budget_preferences` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `favorite_color` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `skin_tone_classification` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `style_preferences` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokens` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Closet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clothing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Closet" DROP CONSTRAINT "Closet_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Clothing" DROP CONSTRAINT "Clothing_closet_id_fkey";

-- DropForeignKey
ALTER TABLE "Clothing" DROP CONSTRAINT "Clothing_user_id_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "birth_date",
DROP COLUMN "budget_preferences",
DROP COLUMN "favorite_color",
DROP COLUMN "first_name",
DROP COLUMN "gender",
DROP COLUMN "height",
DROP COLUMN "last_name",
DROP COLUMN "skin_tone_classification",
DROP COLUMN "style_preferences",
DROP COLUMN "tokens",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Closet";

-- DropTable
DROP TABLE "Clothing";

-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "vaccine_photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "check_in_date" TEXT NOT NULL,
    "check_out_date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "closet_id" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pet_id_key" ON "Pet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_serial_key" ON "Pet"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_id_key" ON "Booking"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_serial_key" ON "Booking"("serial");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
