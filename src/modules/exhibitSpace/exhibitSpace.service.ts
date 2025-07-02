import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createExhibitSpace = async (
  data: Prisma.ExhibitSpaceCreateInput,
) => {
  return prisma.exhibitSpace.create({
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
    },
  });
};

export const getExhibitSpaces = async (filters?: {
  culturalExhibitId?: string;
  levelId?: string;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.ExhibitSpaceWhereInput = {};

  if (filters?.culturalExhibitId) {
    where.culturalExhibitId = filters.culturalExhibitId;
  }
  if (filters?.levelId) {
    where.levelId = filters.levelId;
  }

  return prisma.exhibitSpace.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getExhibitSpaceById = async (id: string) => {
  return prisma.exhibitSpace.findUnique({
    where: { id },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
    },
  });
};

export const updateExhibitSpace = async (
  id: string,
  data: Prisma.ExhibitSpaceUpdateInput,
) => {
  return prisma.exhibitSpace.update({
    where: { id },
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
    },
  });
};

export const deleteExhibitSpace = async (id: string) => {
  return prisma.exhibitSpace.delete({ where: { id } });
};
