-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "isStarted" BOOLEAN NOT NULL DEFAULT false,
    "userInteracted" BOOLEAN NOT NULL DEFAULT false,
    "adminUserId" TEXT NOT NULL,
    "activatedTicketId" TEXT NOT NULL,
    "exhibitItineraryId" TEXT NOT NULL,
    "culturalExhibitId" TEXT NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TourMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TourMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Tour_adminUserId_idx" ON "Tour"("adminUserId");

-- CreateIndex
CREATE INDEX "Tour_activatedTicketId_idx" ON "Tour"("activatedTicketId");

-- CreateIndex
CREATE INDEX "Tour_exhibitItineraryId_idx" ON "Tour"("exhibitItineraryId");

-- CreateIndex
CREATE INDEX "Tour_culturalExhibitId_idx" ON "Tour"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "_TourMembers_B_index" ON "_TourMembers"("B");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_activatedTicketId_fkey" FOREIGN KEY ("activatedTicketId") REFERENCES "ActivatedTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_exhibitItineraryId_fkey" FOREIGN KEY ("exhibitItineraryId") REFERENCES "ExhibitItinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourMembers" ADD CONSTRAINT "_TourMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourMembers" ADD CONSTRAINT "_TourMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
