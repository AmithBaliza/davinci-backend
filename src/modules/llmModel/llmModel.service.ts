import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

export const createLLMModel = async (data: Prisma.LLMModelCreateInput) => {
  return prisma.lLMModel.create({
    data,
  });
};

export const getLLMModels = async (filters?: {
  isActive?: boolean;
  isBackup?: boolean;
  provider?: string;
  name?: string;
  healthStatus?: boolean;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.LLMModelWhereInput = {};

  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  if (filters?.isBackup !== undefined) {
    where.isBackup = filters.isBackup;
  }
  if (filters?.provider) {
    where.provider = { contains: filters.provider, mode: "insensitive" };
  }
  if (filters?.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }
  if (filters?.healthStatus !== undefined) {
    where.healthStatus = filters.healthStatus;
  }

  return prisma.lLMModel.findMany({
    where,
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getLLMModelById = async (id: string) => {
  return prisma.lLMModel.findUnique({
    where: { id },
  });
};

export const updateLLMModel = async (
  id: string,
  data: Prisma.LLMModelUpdateInput,
) => {
  return prisma.lLMModel.update({
    where: { id },
    data,
  });
};

export const deleteLLMModel = async (id: string) => {
  return prisma.lLMModel.delete({ where: { id } });
};
