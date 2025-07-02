import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createCulturalPiece = async (
  data: Prisma.CulturalPieceCreateInput,
) => {
  return prisma.culturalPiece.create({
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
  });
};

export const getCulturalPieces = async (filters?: {
  culturalExhibitId?: string;
  levelId?: string;
  exhibitSpaceId?: string;
  type?: string;
  isActive?: boolean;
  greetingAudioAvailable?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.CulturalPieceWhereInput = {};

  if (filters?.culturalExhibitId) {
    where.culturalExhibitId = filters.culturalExhibitId;
  }
  if (filters?.levelId) {
    where.levelId = filters.levelId;
  }
  if (filters?.exhibitSpaceId) {
    where.exhibitSpaceId = filters.exhibitSpaceId;
  }
  if (filters?.type) {
    where.type = filters.type as any;
  }
  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  if (filters?.greetingAudioAvailable !== undefined) {
    where.greetingAudioAvailable = filters.greetingAudioAvailable;
  }

  return prisma.culturalPiece.findMany({
    where,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getCulturalPieceById = async (id: string) => {
  return prisma.culturalPiece.findUnique({
    where: { id },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
  });
};

export const updateCulturalPiece = async (
  id: string,
  data: Prisma.CulturalPieceUpdateInput,
) => {
  return prisma.culturalPiece.update({
    where: { id },
    data,
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
  });
};

export const deleteCulturalPiece = async (id: string) => {
  return prisma.culturalPiece.delete({ where: { id } });
};

export const getCulturalPiecesByType = async (type: string) => {
  return prisma.culturalPiece.findMany({
    where: { type: type as any, isActive: true },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
};

export const getCulturalPiecesByExhibitSpace = async (
  exhibitSpaceId: string,
) => {
  return prisma.culturalPiece.findMany({
    where: { exhibitSpaceId, isActive: true },
    include: {
      culturalExhibit: {
        select: { id: true, name: true, city: true },
      },
      level: {
        select: { id: true, name: true, order: true },
      },
      exhibitSpace: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });
};
