import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

// Enforce unique order among active questions in logic, not schema

export const createSurveyQuestion = async (
  data: Prisma.SurveyQuestionCreateInput,
) => {
  // Enforce unique order among active questions
  if (data.isActive) {
    const existing = await prisma.surveyQuestion.findFirst({
      where: { isActive: true, order: data.order },
    });
    if (existing) {
      throw new Error("An active question with this order already exists.");
    }
  }
  return prisma.surveyQuestion.create({ data });
};

export const getSurveyQuestions = async (filters?: {
  isActive?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.SurveyQuestionWhereInput = {};

  if (filters?.isActive !== undefined) {
    where.isActive = filters.isActive;
  }
  if (filters?.type) {
    where.type = filters.type as any;
  }

  return prisma.surveyQuestion.findMany({
    where,
    orderBy: [{ order: "asc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getSurveyQuestionById = async (id: string) => {
  return prisma.surveyQuestion.findUnique({ where: { id } });
};

export const updateSurveyQuestion = async (
  id: string,
  data: Prisma.SurveyQuestionUpdateInput,
) => {
  // If updating isActive/order, enforce unique order among active questions
  if (data.isActive === true && data.order !== undefined) {
    const existing = await prisma.surveyQuestion.findFirst({
      where: {
        isActive: true,
        order: data.order as number,
        id: { not: id },
      },
    });
    if (existing) {
      throw new Error("An active question with this order already exists.");
    }
  }
  return prisma.surveyQuestion.update({
    where: { id },
    data,
  });
};

export const deleteSurveyQuestion = async (id: string) => {
  return prisma.surveyQuestion.delete({ where: { id } });
};
