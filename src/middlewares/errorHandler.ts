import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let { statusCode = 500, message } = error;

  // Handle Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;
    if (prismaError.code === "P2002") {
      statusCode = 409;
      message = "Resource already exists";
    } else if (prismaError.code === "P2025") {
      statusCode = 404;
      message = "Resource not found";
    }
  }

  // Handle validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === "production" && !error.isOperational) {
    message = "Something went wrong";
  }

  // Use logger instead of console.error
  const logger = require("../config/logger").default;
  logger.error(`Error ${statusCode}: ${message}`, {
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
    },
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
