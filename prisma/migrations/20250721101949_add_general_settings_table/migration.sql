-- CreateTable
CREATE TABLE "GeneralSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "activeLLMModelId" TEXT NOT NULL,
    "importantNotice" JSONB NOT NULL,
    "helpBotEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneralSettings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneralSettings" ADD CONSTRAINT "GeneralSettings_activeLLMModelId_fkey" FOREIGN KEY ("activeLLMModelId") REFERENCES "LLMModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
