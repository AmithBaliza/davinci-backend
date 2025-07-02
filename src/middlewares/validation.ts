import { NextFunction, Request, Response } from "express";
import { z, ZodSchema } from "zod";
import { sendError } from "../utils/responseHandler";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        sendError(res, "Validation failed", 400, { details: errorMessages });
      } else {
        sendError(res, "Validation error", 400, error);
      }
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        sendError(res, "Invalid parameters", 400, { details: errorMessages });
      } else {
        sendError(res, "Parameter validation error", 400, error);
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        sendError(res, "Invalid query parameters", 400, {
          details: errorMessages,
        });
      } else {
        sendError(res, "Query validation error", 400, error);
      }
    }
  };
};
