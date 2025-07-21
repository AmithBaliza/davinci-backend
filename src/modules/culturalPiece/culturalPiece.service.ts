import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

export const createCulturalPiece = async (
  data: Prisma.CulturalPieceCreateInput,
) => {
  // Invalidate cache when creating new cultural piece
  await cacheService.invalidatePattern("cultural-pieces:*");

  return prisma.culturalPiece.create({
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
  });
};

export const getCulturalPieces = async (filters?: {
  culturalExhibitId?: string;
  levelId?: string;
  exhibitSpaceId?: string;
  type?: string;
  isActive?: boolean;
  greetingAudioAvailable?: boolean;
  limit?: number;
  offset?: number;
}) => {
  // Create cache key based on filters
  const cacheKey = `cultural-pieces:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      const where: Prisma.CulturalPieceWhereInput = {};

      if (filters?.culturalExhibitId) {
        where.culturalExhibitId = filters.culturalExhibitId;
      }
      if (filters?.levelId) {
        where.levelId = filters.levelId;
      }
      if (filters?.exhibitSpaceId) {
        where.exhibitSpaceId = filters.exhibitSpaceId;
      }
      if (filters?.type) {
        where.type = filters.type as any;
      }
      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters?.greetingAudioAvailable !== undefined) {
        where.greetingAudioAvailable = filters.greetingAudioAvailable;
      }

      return prisma.culturalPiece.findMany({
        where,
        include: {
          culturalExhibit: {
            select: { id: true, name: true, city: true },
          },
          level: {
            select: { id: true, name: true, order: true },
          },
          exhibitSpace: {
            select: { id: true, name: true },
          },
        },
        orderBy: [{ createdAt: "desc" }],
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });
    },
    1200, // Cache for 20 minutes (cultural pieces change less frequently)
  );
};

export const getCulturalPieceById = async (id: string) => {
  const cacheKey = `cultural-piece:${id}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.culturalPiece.findUnique({
        where: { id },
        include: {
          culturalExhibit: {
            select: { id: true, name: true, city: true },
          },
          level: {
            select: { id: true, name: true, order: true },
          },
          exhibitSpace: {
            select: { id: true, name: true },
          },
        },
      });
    },
    2400, // Cache for 40 minutes (individual pieces accessed frequently during tours)
  );
};

export const updateCulturalPiece = async (
  id: string,
  data: Prisma.CulturalPieceUpdateInput,
) => {
  // Invalidate specific piece cache and list caches
  await cacheService.del(`cultural-piece:${id}`);
  await cacheService.invalidatePattern("cultural-pieces:*");

  return prisma.culturalPiece.update({
    where: { id },
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
  });
};

export const deleteCulturalPiece = async (id: string) => {
  // Invalidate specific piece cache and list caches
  await cacheService.del(`cultural-piece:${id}`);
  await cacheService.invalidatePattern("cultural-pieces:*");

  return prisma.culturalPiece.delete({ where: { id } });
};

export const getCulturalPiecesByType = async (type: string) => {
  return prisma.culturalPiece.findMany({
    where: { type: type as any, isActive: true },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
};

export const getCulturalPiecesByExhibitSpace = async (
  exhibitSpaceId: string,
) => {
  return prisma.culturalPiece.findMany({
    where: { exhibitSpaceId, isActive: true },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
};
