-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('POPULAR', 'MUSEUM', 'MONUMENT', 'CITY');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "city" TEXT NOT NULL,
    "comingSoon" BOOLEAN NOT NULL,
    "isRecommended" BOOLEAN NOT NULL,
    "images" TEXT[],
    "maxTime" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "priority" INTEGER NOT NULL,
    "onOffer" BOOLEAN NOT NULL,
    "offerPrice" DOUBLE PRECISION,
    "recommendedVisitTime" TEXT NOT NULL,
    "type" "TicketType" NOT NULL,
    "culturalExhibitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TicketItineraries" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketItineraries_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Ticket_culturalExhibitId_idx" ON "Ticket"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "Ticket_type_idx" ON "Ticket"("type");

-- CreateIndex
CREATE INDEX "Ticket_isRecommended_idx" ON "Ticket"("isRecommended");

-- CreateIndex
CREATE INDEX "Ticket_comingSoon_idx" ON "Ticket"("comingSoon");

-- CreateIndex
CREATE INDEX "Ticket_onOffer_idx" ON "Ticket"("onOffer");

-- CreateIndex
CREATE INDEX "Ticket_priority_idx" ON "Ticket"("priority");

-- CreateIndex
CREATE INDEX "_TicketItineraries_B_index" ON "_TicketItineraries"("B");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketItineraries" ADD CONSTRAINT "_TicketItineraries_A_fkey" FOREIGN KEY ("A") REFERENCES "ExhibitItinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketItineraries" ADD CONSTRAINT "_TicketItineraries_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
