-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "fromBot" BOOLEAN NOT NULL,
    "isInitial" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "culturalPieceId" TEXT NOT NULL,
    "userId" TEXT,
    "tourId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_culturalPieceId_idx" ON "Message"("culturalPieceId");

-- CreateIndex
CREATE INDEX "Message_userId_idx" ON "Message"("userId");

-- CreateIndex
CREATE INDEX "Message_tourId_idx" ON "Message"("tourId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_culturalPieceId_fkey" FOREIGN KEY ("culturalPieceId") REFERENCES "CulturalPiece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
