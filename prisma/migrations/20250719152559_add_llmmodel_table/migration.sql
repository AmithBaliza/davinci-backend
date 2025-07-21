-- CreateTable
CREATE TABLE "LLMModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "apiUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isBackup" BOOLEAN NOT NULL DEFAULT false,
    "healthStatus" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LLMModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LLMModel_isActive_idx" ON "LLMModel"("isActive");

-- CreateIndex
CREATE INDEX "LLMModel_isBackup_idx" ON "LLMModel"("isBackup");

-- CreateIndex
CREATE INDEX "LLMModel_provider_idx" ON "LLMModel"("provider");
