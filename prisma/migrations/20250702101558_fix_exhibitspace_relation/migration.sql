-- CreateTable
CREATE TABLE "ExhibitSpace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "culturalExhibitId" TEXT NOT NULL,
    "levelId" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExhibitSpace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExhibitSpace_culturalExhibitId_idx" ON "ExhibitSpace"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "ExhibitSpace_levelId_idx" ON "ExhibitSpace"("levelId");

-- AddForeignKey
ALTER TABLE "ExhibitSpace" ADD CONSTRAINT "ExhibitSpace_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExhibitSpace" ADD CONSTRAINT "ExhibitSpace_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Level"("id") ON DELETE CASCADE ON UPDATE CASCADE;
