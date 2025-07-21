import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

export const createTour = async (data: Prisma.TourCreateInput) => {
  // Invalidate tour caches when creating new tour
  await cacheService.invalidatePattern("tours:*");

  return prisma.tour.create({
    data,
    include: {
      adminUser: { select: { id: true, name: true, email: true } },
      activatedTicket: { select: { id: true, name: true } },
      exhibitItinerary: { select: { id: true, name: true } },
      culturalExhibit: { select: { id: true, name: true, city: true } },
      members: { select: { id: true, name: true, email: true } },
    },
  });
};

export const getTours = async (filters?: {
  adminUserId?: string;
  activatedTicketId?: string;
  exhibitItineraryId?: string;
  culturalExhibitId?: string;
  isStarted?: boolean;
  userInteracted?: boolean;
  memberId?: string;
  limit?: number;
  offset?: number;
}) => {
  // Create cache key based on filters
  const cacheKey = `tours:list:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      const where: Prisma.TourWhereInput = {};

      if (filters?.adminUserId) {
        where.adminUserId = filters.adminUserId;
      }
      if (filters?.activatedTicketId) {
        where.activatedTicketId = filters.activatedTicketId;
      }
      if (filters?.exhibitItineraryId) {
        where.exhibitItineraryId = filters.exhibitItineraryId;
      }
      if (filters?.culturalExhibitId) {
        where.culturalExhibitId = filters.culturalExhibitId;
      }
      if (filters?.isStarted !== undefined) {
        where.isStarted = filters.isStarted;
      }
      if (filters?.userInteracted !== undefined) {
        where.userInteracted = filters.userInteracted;
      }
      if (filters?.memberId) {
        where.members = { some: { id: filters.memberId } };
      }

      return prisma.tour.findMany({
        where,
        include: {
          adminUser: { select: { id: true, name: true, email: true } },
          activatedTicket: { select: { id: true, name: true } },
          exhibitItinerary: { select: { id: true, name: true } },
          culturalExhibit: { select: { id: true, name: true, city: true } },
          members: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ createdAt: "desc" }],
        take: filters?.limit || 50,
        skip: filters?.offset || 0,
      });
    },
    300, // Cache for 5 minutes (tours change frequently during active sessions)
  );
};

export const getTourById = async (id: string) => {
  const cacheKey = `tour:${id}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.tour.findUnique({
        where: { id },
        include: {
          adminUser: { select: { id: true, name: true, email: true } },
          activatedTicket: { select: { id: true, name: true } },
          exhibitItinerary: { select: { id: true, name: true } },
          culturalExhibit: { select: { id: true, name: true, city: true } },
          members: { select: { id: true, name: true, email: true } },
          _count: {
            select: { messages: true },
          },
        },
      });
    },
    600, // Cache for 10 minutes (individual tours accessed frequently)
  );
};

export const updateTour = async (id: string, data: Prisma.TourUpdateInput) => {
  // Invalidate tour caches
  await cacheService.del(`tour:${id}`);
  await cacheService.invalidatePattern("tours:list:*");

  return prisma.tour.update({
    where: { id },
    data,
    include: {
      adminUser: { select: { id: true, name: true, email: true } },
      activatedTicket: { select: { id: true, name: true } },
      exhibitItinerary: { select: { id: true, name: true } },
      culturalExhibit: { select: { id: true, name: true, city: true } },
      members: { select: { id: true, name: true, email: true } },
    },
  });
};

export const deleteTour = async (id: string) => {
  // Invalidate tour caches
  await cacheService.del(`tour:${id}`);
  await cacheService.invalidatePattern("tours:list:*");

  return prisma.tour.delete({ where: { id } });
};
