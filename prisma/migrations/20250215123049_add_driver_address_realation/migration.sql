-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Ativo', 'Inativo');

-- CreateTable
CREATE TABLE "Driver" (
    "cpf" VARCHAR(14) NOT NULL,
    "name" TEXT NOT NULL,
    "date_birth" TIMESTAMP(3) NOT NULL,
    "telephone" TEXT,
    "email" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'Ativo',
    "src_cnh" TEXT NOT NULL,
    "src_crlv" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("cpf")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "driver_cpf" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Address_driver_cpf_key" ON "Address"("driver_cpf");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_driver_cpf_fkey" FOREIGN KEY ("driver_cpf") REFERENCES "Driver"("cpf") ON DELETE RESTRICT ON UPDATE CASCADE;
