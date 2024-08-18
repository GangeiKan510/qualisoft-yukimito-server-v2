-- CreateTable
CREATE TABLE "InstantBooking" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "pet_owner_name" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "check_in_date" TEXT NOT NULL,
    "check_out_date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "raw_pet_data" JSONB[],

    CONSTRAINT "InstantBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstantBooking_id_key" ON "InstantBooking"("id");

-- CreateIndex
CREATE UNIQUE INDEX "InstantBooking_serial_key" ON "InstantBooking"("serial");
