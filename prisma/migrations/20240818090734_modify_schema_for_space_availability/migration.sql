-- CreateTable
CREATE TABLE "Yukimito" (
    "id" TEXT NOT NULL,
    "serial" SERIAL NOT NULL,
    "total_pets_checked_in" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Yukimito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Yukimito_id_key" ON "Yukimito"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Yukimito_serial_key" ON "Yukimito"("serial");
