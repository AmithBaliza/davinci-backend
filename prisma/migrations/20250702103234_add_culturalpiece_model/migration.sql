-- CreateEnum
CREATE TYPE "CulturalPieceType" AS ENUM ('MONUMENT', 'PAINTING', 'SCULPTURE');

-- CreateTable
CREATE TABLE "CulturalPiece" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "shortDescription" JSONB NOT NULL,
    "aiDescription" JSONB NOT NULL,
    "initialGreetingText" JSONB NOT NULL,
    "greetingAudioAvailable" BOOLEAN NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "type" "CulturalPieceType" NOT NULL,
    "coordinates" JSONB,
    "images" TEXT[],
    "marker" JSONB,
    "culturalExhibitId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "exhibitSpaceId" TEXT NOT NULL,
    "initialGreetingAudios" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulturalPiece_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CulturalPiece_culturalExhibitId_idx" ON "CulturalPiece"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "CulturalPiece_levelId_idx" ON "CulturalPiece"("levelId");

-- CreateIndex
CREATE INDEX "CulturalPiece_exhibitSpaceId_idx" ON "CulturalPiece"("exhibitSpaceId");

-- CreateIndex
CREATE INDEX "CulturalPiece_type_idx" ON "CulturalPiece"("type");

-- CreateIndex
CREATE INDEX "CulturalPiece_isActive_idx" ON "CulturalPiece"("isActive");

-- AddForeignKey
ALTER TABLE "CulturalPiece" ADD CONSTRAINT "CulturalPiece_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CulturalPiece" ADD CONSTRAINT "CulturalPiece_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CulturalPiece" ADD CONSTRAINT "CulturalPiece_exhibitSpaceId_fkey" FOREIGN KEY ("exhibitSpaceId") REFERENCES "ExhibitSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
