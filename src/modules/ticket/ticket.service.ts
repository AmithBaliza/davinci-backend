import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createTicket = async (data: Prisma.TicketCreateInput) => {
  return prisma.ticket.create({
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
  });
};

export const getTickets = async (filters?: {
  culturalExhibitId?: string;
  city?: string;
  type?: string;
  comingSoon?: boolean;
  isRecommended?: boolean;
  onOffer?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.TicketWhereInput = {};

  if (filters?.culturalExhibitId) {
    where.culturalExhibitId = filters.culturalExhibitId;
  }
  if (filters?.city) {
    where.city = { contains: filters.city, mode: "insensitive" };
  }
  if (filters?.type) {
    where.type = filters.type as any;
  }
  if (filters?.comingSoon !== undefined) {
    where.comingSoon = filters.comingSoon;
  }
  if (filters?.isRecommended !== undefined) {
    where.isRecommended = filters.isRecommended;
  }
  if (filters?.onOffer !== undefined) {
    where.onOffer = filters.onOffer;
  }
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      where.price.gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      where.price.lte = filters.maxPrice;
    }
  }

  return prisma.ticket.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getTicketById = async (id: string) => {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
  });
};

export const updateTicket = async (
  id: string,
  data: Prisma.TicketUpdateInput,
) => {
  return prisma.ticket.update({
    where: { id },
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
  });
};

export const deleteTicket = async (id: string) => {
  return prisma.ticket.delete({ where: { id } });
};

export const getRecommendedTickets = async (city?: string) => {
  const where: Prisma.TicketWhereInput = {
    isRecommended: true,
  };

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  return prisma.ticket.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
};

export const getTicketsOnOffer = async (city?: string) => {
  const where: Prisma.TicketWhereInput = {
    onOffer: true,
  };

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  return prisma.ticket.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
};

export const getTicketsByType = async (type: string, city?: string) => {
  const where: Prisma.TicketWhereInput = {
    type: type as any,
  };

  if (city) {
    where.city = { contains: city, mode: "insensitive" };
  }

  return prisma.ticket.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      exhibitItineraries: {
        select: { id: true, name: true, rank: true },
      },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
  });
};
