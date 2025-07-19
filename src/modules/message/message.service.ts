import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createMessage = async (data: Prisma.MessageCreateInput) => {
  return prisma.message.create({
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true } },
      culturalPiece: { select: { id: true, name: true } },
    },
  });
};

export const getMessages = async (filters?: {
  userId?: string;
  tourId?: string;
  culturalPieceId?: string;
  fromBot?: boolean;
  isInitial?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.MessageWhereInput = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.tourId) {
    where.tourId = filters.tourId;
  }
  if (filters?.culturalPieceId) {
    where.culturalPieceId = filters.culturalPieceId;
  }
  if (filters?.fromBot !== undefined) {
    where.fromBot = filters.fromBot;
  }
  if (filters?.isInitial !== undefined) {
    where.isInitial = filters.isInitial;
  }

  return prisma.message.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true } },
      culturalPiece: { select: { id: true, name: true } },
    },
    orderBy: [{ createdAt: "asc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getMessageById = async (id: string) => {
  return prisma.message.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true } },
      culturalPiece: { select: { id: true, name: true } },
    },
  });
};

export const updateMessage = async (
  id: string,
  data: Prisma.MessageUpdateInput,
) => {
  return prisma.message.update({
    where: { id },
    data,
    include: {
      user: { select: { id: true, name: true, email: true } },
      tour: { select: { id: true } },
      culturalPiece: { select: { id: true, name: true } },
    },
  });
};

export const deleteMessage = async (id: string) => {
  return prisma.message.delete({ where: { id } });
};
