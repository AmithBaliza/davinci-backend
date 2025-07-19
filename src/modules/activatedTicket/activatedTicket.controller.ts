import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as activatedTicketService from "./activatedTicket.service";

export const createActivatedTicket = async (req: Request, res: Response) => {
  try {
    let data = { ...req.body };

    if (data.isFree) {
      // If expirationTime is not provided, set it to 1 week from now
      if (!data.expirationTime) {
        const now = new Date();
        const expiration = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        data.expirationTime = expiration.toISOString();
      }
    } else {
      data.expirationTime = null;
    }

    const activatedTicket = await activatedTicketService.createActivatedTicket(
      data,
    );
    sendCreated(res, activatedTicket, "Activated ticket created successfully");
  } catch (error) {
    sendError(res, "Failed to create activated ticket", 400, error);
  }
};

export const getActivatedTickets = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      ticketId,
      culturalExhibitId,
      isActivated,
      isExpired,
      isFree,
      isPhysical,
      limit,
      offset,
    } = req.query;
    const activatedTickets = await activatedTicketService.getActivatedTickets({
      userId: userId as string | undefined,
      ticketId: ticketId as string | undefined,
      culturalExhibitId: culturalExhibitId as string | undefined,
      isActivated:
        isActivated !== undefined ? isActivated === "true" : undefined,
      isExpired: isExpired !== undefined ? isExpired === "true" : undefined,
      isFree: isFree !== undefined ? isFree === "true" : undefined,
      isPhysical: isPhysical !== undefined ? isPhysical === "true" : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(
      res,
      activatedTickets,
      "Activated tickets retrieved successfully",
    );
  } catch (error) {
    sendError(res, "Failed to retrieve activated tickets", 500, error);
  }
};

export const getActivatedTicketById = async (req: Request, res: Response) => {
  try {
    const activatedTicket = await activatedTicketService.getActivatedTicketById(
      req.params.id,
    );
    if (!activatedTicket) {
      throw new CustomError("Activated ticket not found", 404);
    }
    sendSuccess(
      res,
      activatedTicket,
      "Activated ticket retrieved successfully",
    );
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve activated ticket", 500, error);
    }
  }
};

export const updateActivatedTicket = async (req: Request, res: Response) => {
  try {
    const activatedTicket = await activatedTicketService.updateActivatedTicket(
      req.params.id,
      req.body,
    );
    sendSuccess(res, activatedTicket, "Activated ticket updated successfully");
  } catch (error) {
    sendError(res, "Failed to update activated ticket", 400, error);
  }
};

export const deleteActivatedTicket = async (req: Request, res: Response) => {
  try {
    await activatedTicketService.deleteActivatedTicket(req.params.id);
    sendNoContent(res, "Activated ticket deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete activated ticket", 500, error);
  }
};

// Example: get all active tickets for a user
export const getActiveTicketsForUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      throw new CustomError("userId is required", 400);
    }
    const tickets = await activatedTicketService.getActiveTicketsForUser(
      userId as string,
    );
    sendSuccess(res, tickets, "Active tickets for user retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve active tickets for user", 500, error);
    }
  }
};
