import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

export const createLLMModel = async (data: Prisma.LLMModelCreateInput) => {
  // Invalidate ALL LLM caches when creating new model
  await cacheService.invalidatePattern("llm:*");

  return prisma.lLMModel.create({
    data,
  });
};

export const getLLMModels = async (filters?: {
  isActive?: boolean;
  isBackup?: boolean;
  provider?: string;
  name?: string;
  healthStatus?: boolean;
  limit?: number;
  offset?: number;
}) => {
  // Create cache key based on filters
  const cacheKey = `llm:models:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      const where: Prisma.LLMModelWhereInput = {};

      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters?.isBackup !== undefined) {
        where.isBackup = filters.isBackup;
      }
      if (filters?.provider) {
        where.provider = { contains: filters.provider, mode: "insensitive" };
      }
      if (filters?.name) {
        where.name = { contains: filters.name, mode: "insensitive" };
      }
      if (filters?.healthStatus !== undefined) {
        where.healthStatus = filters.healthStatus;
      }

      return prisma.lLMModel.findMany({
        where,
        orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });
    },
    3600, // Cache for 1 hour (LLM configs don't change frequently)
  );
};

// CRITICAL: Get active LLM model (called on every message)
export const getActiveLLMModel = async () => {
  const cacheKey = "llm:active-model";

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.lLMModel.findFirst({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          provider: true,
          apiUrl: true,
          apiKey: true,
          config: true,
          healthStatus: true,
        },
      });
    },
    7200, // Cache for 2 hours (very stable data, accessed frequently)
  );
};

// Get backup LLM model (fallback for message processing)
export const getBackupLLMModel = async () => {
  const cacheKey = "llm:backup-model";

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.lLMModel.findFirst({
        where: { isBackup: true, healthStatus: true },
        select: {
          id: true,
          name: true,
          provider: true,
          apiUrl: true,
          apiKey: true,
          config: true,
          healthStatus: true,
        },
      });
    },
    7200, // Cache for 2 hours
  );
};

export const getLLMModelById = async (id: string) => {
  return prisma.lLMModel.findUnique({
    where: { id },
  });
};

export const updateLLMModel = async (
  id: string,
  data: Prisma.LLMModelUpdateInput,
) => {
  // CRITICAL: Invalidate ALL LLM caches when updating (could affect active model)
  await cacheService.invalidatePattern("llm:*");

  return prisma.lLMModel.update({
    where: { id },
    data,
  });
};

export const deleteLLMModel = async (id: string) => {
  // CRITICAL: Invalidate ALL LLM caches when deleting
  await cacheService.invalidatePattern("llm:*");

  return prisma.lLMModel.delete({ where: { id } });
};
