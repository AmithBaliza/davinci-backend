-- CreateTable
CREATE TABLE "ExhibitItinerary" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "minDuration" INTEGER NOT NULL,
    "maxDuration" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isCustom" BOOLEAN NOT NULL,
    "isPreferred" BOOLEAN NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "rank" INTEGER NOT NULL,
    "culturalPiecesRanking" JSONB NOT NULL,
    "culturalExhibitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExhibitItinerary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExhibitItinerary_culturalExhibitId_idx" ON "ExhibitItinerary"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "ExhibitItinerary_isActive_idx" ON "ExhibitItinerary"("isActive");

-- CreateIndex
CREATE INDEX "ExhibitItinerary_isCustom_idx" ON "ExhibitItinerary"("isCustom");

-- CreateIndex
CREATE INDEX "ExhibitItinerary_isPreferred_idx" ON "ExhibitItinerary"("isPreferred");

-- CreateIndex
CREATE INDEX "ExhibitItinerary_rank_idx" ON "ExhibitItinerary"("rank");

-- AddForeignKey
ALTER TABLE "ExhibitItinerary" ADD CONSTRAINT "ExhibitItinerary_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
