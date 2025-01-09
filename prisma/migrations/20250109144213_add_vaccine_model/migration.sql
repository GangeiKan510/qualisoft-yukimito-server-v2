-- CreateTable
CREATE TABLE "Vaccine" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "batchNumber" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "dateAdministered" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vaccine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vaccine_id_key" ON "Vaccine"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Vaccine_serial_key" ON "Vaccine"("serial");
