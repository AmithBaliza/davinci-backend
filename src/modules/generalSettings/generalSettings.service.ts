import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

// There will only ever be one row in the GeneralSettings table (id = 1)

export const getGeneralSettings = async () => {
  return prisma.generalSettings.findUnique({
    where: { id: 1 },
    include: {
      activeLLMModel: true,
    },
  });
};

export const updateGeneralSettings = async (
  data: Prisma.GeneralSettingsUpdateInput,
) => {
  return prisma.generalSettings.update({
    where: { id: 1 },
    data,
    include: {
      activeLLMModel: true,
    },
  });
};

// Optionally, create the row if it doesn't exist (should only be called once)
export const initGeneralSettings = async (
  data: Prisma.GeneralSettingsCreateInput,
) => {
  return prisma.generalSettings.create({
    data: { ...data, id: 1 },
    include: {
      activeLLMModel: true,
    },
  });
};
