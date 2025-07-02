import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCulturalExhibit = async (
  data: Prisma.CulturalExhibitCreateInput,
) => {
  return prisma.culturalExhibit.create({ data });
};

export const getCulturalExhibits = async () => {
  return prisma.culturalExhibit.findMany();
};

export const getCulturalExhibitById = async (id: string) => {
  return prisma.culturalExhibit.findUnique({ where: { id } });
};

export const updateCulturalExhibit = async (
  id: string,
  data: Prisma.CulturalExhibitUpdateInput,
) => {
  return prisma.culturalExhibit.update({ where: { id }, data });
};

export const deleteCulturalExhibit = async (id: string) => {
  return prisma.culturalExhibit.delete({ where: { id } });
};
