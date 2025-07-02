import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createLevel = async (data: Prisma.LevelCreateInput) => {
  return prisma.level.create({
    data,
    include: {
      culturalExhibit: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });
};

export const getLevels = async (filters?: {
  culturalExhibitId?: string;
  order?: number;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.LevelWhereInput = {};

  if (filters?.culturalExhibitId) {
    where.culturalExhibitId = filters.culturalExhibitId;
  }

  if (filters?.order !== undefined) {
    where.order = filters.order;
  }

  return prisma.level.findMany({
    where,
    include: {
      culturalExhibit: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getLevelById = async (id: string) => {
  return prisma.level.findUnique({
    where: { id },
    include: {
      culturalExhibit: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });
};

export const getLevelsByCulturalExhibitId = async (
  culturalExhibitId: string,
) => {
  return prisma.level.findMany({
    where: { culturalExhibitId },
    include: {
      culturalExhibit: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
    orderBy: { order: "asc" },
  });
};

export const updateLevel = async (
  id: string,
  data: Prisma.LevelUpdateInput,
) => {
  return prisma.level.update({
    where: { id },
    data,
    include: {
      culturalExhibit: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });
};

export const deleteLevel = async (id: string) => {
  return prisma.level.delete({ where: { id } });
};

export const reorderLevels = async (
  culturalExhibitId: string,
  levelOrders: { id: string; order: number }[],
) => {
  return prisma.$transaction(
    levelOrders.map(({ id, order }) =>
      prisma.level.update({
        where: { id, culturalExhibitId },
        data: { order },
      }),
    ),
  );
};
