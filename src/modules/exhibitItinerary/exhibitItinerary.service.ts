import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

export const createExhibitItinerary = async (
  data: Prisma.ExhibitItineraryCreateInput,
) => {
  // Invalidate itinerary caches when creating new itinerary
  await cacheService.invalidatePattern("itineraries:*");

  return prisma.exhibitItinerary.create({
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};

export const getExhibitItineraries = async (filters?: {
  culturalExhibitId?: string;
  isActive?: boolean;
  isCustom?: boolean;
  isPreferred?: boolean;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
}) => {
  // Create cache key based on filters
  const cacheKey = `itineraries:list:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      const where: Prisma.ExhibitItineraryWhereInput = {};

      if (filters?.culturalExhibitId) {
        where.culturalExhibitId = filters.culturalExhibitId;
      }
      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }
      if (filters?.isCustom !== undefined) {
        where.isCustom = filters.isCustom;
      }
      if (filters?.isPreferred !== undefined) {
        where.isPreferred = filters.isPreferred;
      }
      if (filters?.minDuration !== undefined) {
        where.minDuration = { gte: filters.minDuration };
      }
      if (filters?.maxDuration !== undefined) {
        where.maxDuration = { lte: filters.maxDuration };
      }

      return prisma.exhibitItinerary.findMany({
        where,
        include: {
          culturalExhibit: {
            select: { id: true, name: true, city: true },
          },
        },
        orderBy: [{ rank: "asc" }, { createdAt: "desc" }],
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });
    },
    1800, // Cache for 30 minutes (itineraries don't change frequently)
  );
};

export const getExhibitItineraryById = async (id: string) => {
  return prisma.exhibitItinerary.findUnique({
    where: { id },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};

export const updateExhibitItinerary = async (
  id: string,
  data: Prisma.ExhibitItineraryUpdateInput,
) => {
  return prisma.exhibitItinerary.update({
    where: { id },
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};

export const deleteExhibitItinerary = async (id: string) => {
  return prisma.exhibitItinerary.delete({ where: { id } });
};

export const getPreferredItineraries = async (culturalExhibitId?: string) => {
  const where: Prisma.ExhibitItineraryWhereInput = {
    isPreferred: true,
    isActive: true,
  };

  if (culturalExhibitId) {
    where.culturalExhibitId = culturalExhibitId;
  }

  return prisma.exhibitItinerary.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
    orderBy: [{ rank: "asc" }, { likes: "desc" }],
  });
};

export const getCustomItineraries = async (culturalExhibitId?: string) => {
  const where: Prisma.ExhibitItineraryWhereInput = {
    isCustom: true,
    isActive: true,
  };

  if (culturalExhibitId) {
    where.culturalExhibitId = culturalExhibitId;
  }

  return prisma.exhibitItinerary.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
    orderBy: [{ likes: "desc" }, { createdAt: "desc" }],
  });
};

export const incrementLikes = async (id: string) => {
  return prisma.exhibitItinerary.update({
    where: { id },
    data: {
      likes: {
        increment: 1,
      },
    },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};
