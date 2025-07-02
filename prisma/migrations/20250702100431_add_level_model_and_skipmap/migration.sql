/*
  Warnings:

  - Added the required column `skipMap` to the `CulturalExhibit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CulturalExhibit" ADD COLUMN     "skipMap" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Level" (
    "id" TEXT NOT NULL,
    "culturalExhibitId" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "mainImage" TEXT NOT NULL,
    "mapImage" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Level_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Level_culturalExhibitId_idx" ON "Level"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "Level_order_idx" ON "Level"("order");

-- AddForeignKey
ALTER TABLE "Level" ADD CONSTRAINT "Level_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
