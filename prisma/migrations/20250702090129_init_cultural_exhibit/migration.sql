-- CreateTable
CREATE TABLE "CulturalExhibit" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "ai" JSONB NOT NULL,
    "importantNotice" JSONB NOT NULL,
    "city" TEXT NOT NULL,
    "comingSoon" BOOLEAN NOT NULL,
    "closingTime" TIMESTAMP(3) NOT NULL,
    "disableGroup" BOOLEAN NOT NULL,
    "geoCoordinates" JSONB NOT NULL,
    "gpsAvailable" BOOLEAN NOT NULL,
    "images" TEXT[],
    "openingTime" TIMESTAMP(3) NOT NULL,
    "priority" INTEGER NOT NULL,
    "textOnly" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CulturalExhibit_pkey" PRIMARY KEY ("id")
);
