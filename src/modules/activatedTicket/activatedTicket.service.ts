import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createActivatedTicket = async (
  data: Prisma.ActivatedTicketCreateInput,
) => {
  return prisma.activatedTicket.create({
    data,
    include: {
      ticket: {
        select: { id: true, name: true, price: true },
      },
      user: {
        select: { id: true, email: true, name: true },
      },
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};

export const getActivatedTickets = async (filters?: {
  userId?: string;
  ticketId?: string;
  culturalExhibitId?: string;
  isActivated?: boolean;
  isExpired?: boolean;
  isFree?: boolean;
  isPhysical?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.ActivatedTicketWhereInput = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.ticketId) {
    where.ticketId = filters.ticketId;
  }
  if (filters?.culturalExhibitId) {
    where.culturalExhibitId = filters.culturalExhibitId;
  }
  if (filters?.isActivated !== undefined) {
    where.isActivated = filters.isActivated;
  }
  if (filters?.isExpired !== undefined) {
    where.isExpired = filters.isExpired;
  }
  if (filters?.isFree !== undefined) {
    where.isFree = filters.isFree;
  }
  if (filters?.isPhysical !== undefined) {
    where.isPhysical = filters.isPhysical;
  }

  return prisma.activatedTicket.findMany({
    where,
    include: {
      ticket: {
        select: { id: true, name: true, price: true },
      },
      user: {
        select: { id: true, email: true, name: true },
      },
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getActivatedTicketById = async (id: string) => {
  return prisma.activatedTicket.findUnique({
    where: { id },
    include: {
      ticket: {
        select: { id: true, name: true, price: true },
      },
      user: {
        select: { id: true, email: true, name: true },
      },
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};

export const updateActivatedTicket = async (
  id: string,
  data: Prisma.ActivatedTicketUpdateInput,
) => {
  return prisma.activatedTicket.update({
    where: { id },
    data,
    include: {
      ticket: {
        select: { id: true, name: true, price: true },
      },
      user: {
        select: { id: true, email: true, name: true },
      },
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
  });
};

export const deleteActivatedTicket = async (id: string) => {
  return prisma.activatedTicket.delete({ where: { id } });
};

// Example: get all active tickets for a user
export const getActiveTicketsForUser = async (userId: string) => {
  return prisma.activatedTicket.findMany({
    where: {
      userId,
      isActivated: true,
      isExpired: false,
    },
    include: {
      ticket: {
        select: { id: true, name: true, price: true },
      },
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
};
