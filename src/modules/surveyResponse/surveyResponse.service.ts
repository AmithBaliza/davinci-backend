import { Prisma } from "@prisma/client";
import prisma from "../../config/database";

// SurveyResponse CRUD

export const createSurveyResponse = async (
  data: Prisma.SurveyResponseCreateInput,
) => {
  return prisma.surveyResponse.create({
    data,
    include: {
      tour: true,
      user: true,
      itinerary: true,
      answers: true,
    },
  });
};

export const getSurveyResponses = async (filters?: {
  userId?: string;
  tourId?: string;
  itineraryId?: string;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.SurveyResponseWhereInput = {};

  if (filters?.userId) {
    where.userId = filters.userId;
  }
  if (filters?.tourId) {
    where.tourId = filters.tourId;
  }
  if (filters?.itineraryId) {
    where.itineraryId = filters.itineraryId;
  }

  return prisma.surveyResponse.findMany({
    where,
    include: {
      tour: true,
      user: true,
      itinerary: true,
      answers: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getSurveyResponseById = async (id: string) => {
  return prisma.surveyResponse.findUnique({
    where: { id },
    include: {
      tour: true,
      user: true,
      itinerary: true,
      answers: true,
    },
  });
};

export const updateSurveyResponse = async (
  id: string,
  data: Prisma.SurveyResponseUpdateInput,
) => {
  return prisma.surveyResponse.update({
    where: { id },
    data,
    include: {
      tour: true,
      user: true,
      itinerary: true,
      answers: true,
    },
  });
};

export const deleteSurveyResponse = async (id: string) => {
  return prisma.surveyResponse.delete({ where: { id } });
};

// SurveyAnswer CRUD

export const createSurveyAnswer = async (
  data: Prisma.SurveyAnswerCreateInput,
) => {
  return prisma.surveyAnswer.create({
    data,
    include: {
      surveyResponse: true,
      question: true,
    },
  });
};

export const getSurveyAnswers = async (filters?: {
  surveyResponseId?: string;
  questionId?: string;
  userId?: string;
  language?: string;
  limit?: number;
  offset?: number;
}) => {
  const where: Prisma.SurveyAnswerWhereInput = {};

  if (filters?.surveyResponseId) {
    where.surveyResponseId = filters.surveyResponseId;
  }
  if (filters?.questionId) {
    where.questionId = filters.questionId;
  }
  if (filters?.userId) {
    where.surveyResponse = { userId: filters.userId };
  }
  if (filters?.language) {
    where.language = filters.language as any;
  }

  return prisma.surveyAnswer.findMany({
    where,
    include: {
      surveyResponse: true,
      question: true,
    },
    orderBy: [{ createdAt: "desc" }],
    take: filters?.limit,
    skip: filters?.offset,
  });
};

export const getSurveyAnswerById = async (id: string) => {
  return prisma.surveyAnswer.findUnique({
    where: { id },
    include: {
      surveyResponse: true,
      question: true,
    },
  });
};

export const updateSurveyAnswer = async (
  id: string,
  data: Prisma.SurveyAnswerUpdateInput,
) => {
  return prisma.surveyAnswer.update({
    where: { id },
    data,
    include: {
      surveyResponse: true,
      question: true,
    },
  });
};

export const deleteSurveyAnswer = async (id: string) => {
  return prisma.surveyAnswer.delete({ where: { id } });
};
