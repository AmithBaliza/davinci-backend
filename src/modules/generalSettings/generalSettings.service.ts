import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

// There will only ever be one row in the GeneralSettings table (id = 1)

// CRITICAL: Get general settings (includes active LLM model - called frequently)
export const getGeneralSettings = async () => {
  const cacheKey = "settings:general";

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.generalSettings.findUnique({
        where: { id: 1 },
        include: {
          activeLLMModel: {
            select: {
              id: true,
              name: true,
              provider: true,
              apiUrl: true,
              apiKey: true,
              config: true,
              healthStatus: true,
            },
          },
        },
      });
    },
    7200, // Cache for 2 hours (very stable, accessed on every message)
  );
};

export const updateGeneralSettings = async (
  data: Prisma.GeneralSettingsUpdateInput,
) => {
  // CRITICAL: Invalidate settings cache AND LLM caches (active model might change)
  await cacheService.del("settings:general");
  await cacheService.invalidatePattern("llm:*");

  return prisma.generalSettings.update({
    where: { id: 1 },
    data,
    include: {
      activeLLMModel: true,
    },
  });
};

// Optionally, create the row if it doesn't exist (should only be called once)
export const initGeneralSettings = async (
  data: Prisma.GeneralSettingsCreateInput,
) => {
  // Invalidate caches when initializing
  await cacheService.del("settings:general");
  await cacheService.invalidatePattern("llm:*");

  return prisma.generalSettings.create({
    data: { ...data, id: 1 },
    include: {
      activeLLMModel: true,
    },
  });
};
