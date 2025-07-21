import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

export const createCulturalExhibit = async (
  data: Prisma.CulturalExhibitCreateInput,
) => {
  // Invalidate cache when creating new exhibit
  await cacheService.invalidatePattern("cultural-exhibits:*");
  return prisma.culturalExhibit.create({ data });
};

export const getCulturalExhibits = async (filters?: {
  city?: string;
  comingSoon?: boolean;
  limit?: number;
  offset?: number;
}) => {
  // Create cache key based on filters
  const cacheKey = `cultural-exhibits:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      const where: any = {};

      if (filters?.city) {
        where.city = { contains: filters.city, mode: "insensitive" };
      }
      if (filters?.comingSoon !== undefined) {
        where.comingSoon = filters.comingSoon;
      }

      return prisma.culturalExhibit.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          city: true,
          comingSoon: true,
          images: true,
          priority: true,
          geoCoordinates: true,
          openingTime: true,
          closingTime: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
      });
    },
    1800, // Cache for 30 minutes
  );
};

export const getCulturalExhibitById = async (id: string) => {
  const cacheKey = `cultural-exhibit:${id}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.culturalExhibit.findUnique({
        where: { id },
        include: {
          levels: {
            select: { id: true, name: true, order: true },
          },
          exhibitSpaces: {
            select: { id: true, name: true },
          },
          _count: {
            select: { culturalPieces: true, tickets: true },
          },
        },
      });
    },
    3600, // Cache for 1 hour
  );
};

export const updateCulturalExhibit = async (
  id: string,
  data: Prisma.CulturalExhibitUpdateInput,
) => {
  // Invalidate specific exhibit cache and list caches
  await cacheService.del(`cultural-exhibit:${id}`);
  await cacheService.invalidatePattern("cultural-exhibits:*");

  return prisma.culturalExhibit.update({ where: { id }, data });
};

export const deleteCulturalExhibit = async (id: string) => {
  // Invalidate specific exhibit cache and list caches
  await cacheService.del(`cultural-exhibit:${id}`);
  await cacheService.invalidatePattern("cultural-exhibits:*");

  return prisma.culturalExhibit.delete({ where: { id } });
};
