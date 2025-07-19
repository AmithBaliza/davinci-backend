import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createTour = async (data: Prisma.TourCreateInput) => {
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
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getTourById = async (id: string) => {
  return prisma.tour.findUnique({
    where: { id },
    include: {
      adminUser: { select: { id: true, name: true, email: true } },
      activatedTicket: { select: { id: true, name: true } },
      exhibitItinerary: { select: { id: true, name: true } },
      culturalExhibit: { select: { id: true, name: true, city: true } },
      members: { select: { id: true, name: true, email: true } },
    },
  });
};

export const updateTour = async (id: string, data: Prisma.TourUpdateInput) => {
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
  return prisma.tour.delete({ where: { id } });
};
