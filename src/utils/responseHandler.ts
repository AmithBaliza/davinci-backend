import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    stack?: string;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = "Success",
  statusCode: number = 200,
): void => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any,
): void => {
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === "development" &&
        error?.stack && { stack: error.stack }),
    },
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = "Resource created successfully",
): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNoContent = (
  res: Response,
  message: string = "Resource deleted successfully",
): void => {
  res.status(204).json({
    success: true,
    message,
  });
};
