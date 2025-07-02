import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as ticketService from "./ticket.service";

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    sendCreated(res, ticket, "Ticket created successfully");
  } catch (error) {
    sendError(res, "Failed to create ticket", 400, error);
  }
};

export const getTickets = async (req: Request, res: Response) => {
  try {
    const {
      culturalExhibitId,
      city,
      type,
      comingSoon,
      isRecommended,
      onOffer,
      minPrice,
      maxPrice,
      limit,
      offset,
    } = req.query;
    const tickets = await ticketService.getTickets({
      culturalExhibitId: culturalExhibitId as string | undefined,
      city: city as string | undefined,
      type: type as string | undefined,
      comingSoon: comingSoon !== undefined ? comingSoon === "true" : undefined,
      isRecommended:
        isRecommended !== undefined ? isRecommended === "true" : undefined,
      onOffer: onOffer !== undefined ? onOffer === "true" : undefined,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, tickets, "Tickets retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve tickets", 500, error);
  }
};

export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.getTicketById(req.params.id);
    if (!ticket) {
      throw new CustomError("Ticket not found", 404);
    }
    sendSuccess(res, ticket, "Ticket retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve ticket", 500, error);
    }
  }
};

export const updateTicket = async (req: Request, res: Response) => {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    sendSuccess(res, ticket, "Ticket updated successfully");
  } catch (error) {
    sendError(res, "Failed to update ticket", 400, error);
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  try {
    await ticketService.deleteTicket(req.params.id);
    sendNoContent(res, "Ticket deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete ticket", 500, error);
  }
};
