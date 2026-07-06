/*
  Warnings:

  - A unique constraint covering the columns `[customerId,gearId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RentalOrder" ALTER COLUMN "quantity" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Review_customerId_gearId_key" ON "Review"("customerId", "gearId");
