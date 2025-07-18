import { Request, Response } from "express";
import { CustomError } from "../../middlewares/errorHandler";
import {
  sendCreated,
  sendError,
  sendNoContent,
  sendSuccess,
} from "../../utils/responseHandler";
import * as userService from "./user.service";

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    sendCreated(res, user, "User created successfully");
  } catch (error) {
    sendError(res, "Failed to create user", 400, error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const {
      role,
      language,
      gender,
      isPrivacyPolicyEnabled,
      ambientMusic,
      communicationEnabled,
      limit,
      offset,
    } = req.query;
    const users = await userService.getUsers({
      role: role as string | undefined,
      language: language as string | undefined,
      gender: gender as string | undefined,
      isPrivacyPolicyEnabled:
        isPrivacyPolicyEnabled !== undefined
          ? isPrivacyPolicyEnabled === "true"
          : undefined,
      ambientMusic:
        ambientMusic !== undefined ? ambientMusic === "true" : undefined,
      communicationEnabled:
        communicationEnabled !== undefined
          ? communicationEnabled === "true"
          : undefined,
      limit: limit !== undefined ? Number(limit) : undefined,
      offset: offset !== undefined ? Number(offset) : undefined,
    });
    sendSuccess(res, users, "Users retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve users", 500, error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    sendSuccess(res, user, "User retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve user", 500, error);
    }
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    let user = await userService.getUserByFirebaseUid(req.user.uid);

    if (!user) {
      // Auto-sync user from Firebase if not found in database
      user = await userService.syncUserFromFirebase(req.user.uid);
    }

    sendSuccess(res, user, "Current user retrieved successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to retrieve current user", 500, error);
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    sendSuccess(res, user, "User updated successfully");
  } catch (error) {
    sendError(res, "Failed to update user", 400, error);
  }
};

export const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    const user = await userService.updateUserByFirebaseUid(
      req.user.uid,
      req.body,
    );
    sendSuccess(res, user, "User profile updated successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to update user profile", 400, error);
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);
    sendNoContent(res, "User deleted successfully");
  } catch (error) {
    sendError(res, "Failed to delete user", 500, error);
  }
};

export const syncUserFromFirebase = async (req: Request, res: Response) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    const user = await userService.syncUserFromFirebase(req.user.uid);
    sendSuccess(res, user, "User synced from Firebase successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to sync user from Firebase", 500, error);
    }
  }
};

export const getUserStats = async (req: Request, res: Response) => {
  try {
    const stats = await userService.getUserStats();
    sendSuccess(res, stats, "User statistics retrieved successfully");
  } catch (error) {
    sendError(res, "Failed to retrieve user statistics", 500, error);
  }
};

export const incrementNotificationCount = async (
  req: Request,
  res: Response,
) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    const user = await userService.incrementNotificationCount(req.user.uid);
    sendSuccess(res, user, "Notification count incremented successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to increment notification count", 500, error);
    }
  }
};

export const resetNotificationCount = async (req: Request, res: Response) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    const user = await userService.resetNotificationCount(req.user.uid);
    sendSuccess(res, user, "Notification count reset successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to reset notification count", 500, error);
    }
  }
};
