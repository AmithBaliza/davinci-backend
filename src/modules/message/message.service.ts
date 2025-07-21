import { Prisma } from "@prisma/client";
import prisma from "../../config/database";
import cacheService from "../../services/cache.service";

export const createMessage = async (data: Prisma.MessageCreateInput) => {
  // Invalidate message caches when creating new message
  await cacheService.invalidatePattern("messages:*");

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
  // Create cache key based on filters
  const cacheKey = `messages:list:${JSON.stringify(filters || {})}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
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
        take: filters?.limit || 100,
        skip: filters?.offset || 0,
      });
    },
    120, // Cache for 2 minutes (messages change frequently during tours)
  );
};

export const getMessageById = async (id: string) => {
  const cacheKey = `message:${id}`;

  return cacheService.withCache(
    cacheKey,
    async () => {
      return prisma.message.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, name: true, email: true } },
          tour: { select: { id: true } },
          culturalPiece: { select: { id: true, name: true } },
        },
      });
    },
    300, // Cache for 5 minutes
  );
};

export const updateMessage = async (
  id: string,
  data: Prisma.MessageUpdateInput,
) => {
  // Invalidate message caches
  await cacheService.del(`message:${id}`);
  await cacheService.invalidatePattern("messages:list:*");

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
  // Invalidate message caches
  await cacheService.del(`message:${id}`);
  await cacheService.invalidatePattern("messages:list:*");

  return prisma.message.delete({ where: { id } });
};
