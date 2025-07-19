-- CreateTable
CREATE TABLE "ActivatedTicket" (
    "id" TEXT NOT NULL,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL,
    "isPhysical" BOOLEAN NOT NULL,
    "images" TEXT[],
    "maxTime" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "culturalExhibitId" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expirationTime" TIMESTAMP(3),

    CONSTRAINT "ActivatedTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivatedTicket_ticketId_idx" ON "ActivatedTicket"("ticketId");

-- CreateIndex
CREATE INDEX "ActivatedTicket_culturalExhibitId_idx" ON "ActivatedTicket"("culturalExhibitId");

-- CreateIndex
CREATE INDEX "ActivatedTicket_userId_idx" ON "ActivatedTicket"("userId");

-- AddForeignKey
ALTER TABLE "ActivatedTicket" ADD CONSTRAINT "ActivatedTicket_culturalExhibitId_fkey" FOREIGN KEY ("culturalExhibitId") REFERENCES "CulturalExhibit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivatedTicket" ADD CONSTRAINT "ActivatedTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivatedTicket" ADD CONSTRAINT "ActivatedTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
