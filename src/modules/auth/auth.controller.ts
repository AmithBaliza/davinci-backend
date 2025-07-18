import { Request, Response } from "express";
import { firebaseAuth } from "../../config/firebase";
import logger from "../../config/logger";
import { CustomError } from "../../middlewares/errorHandler";
import { sendError, sendSuccess } from "../../utils/responseHandler";
import * as userService from "../user/user.service";

export const verifyToken = async (req: Request, res: Response) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    // Auto-sync user from Firebase if not found in database
    let user = await userService.getUserByFirebaseUid(req.user.uid);

    if (!user) {
      user = await userService.syncUserFromFirebase(req.user.uid);
    }

    sendSuccess(
      res,
      {
        user,
        firebaseUser: {
          uid: req.user.uid,
          email: req.user.email,
          displayName: req.user.displayName,
          photoURL: req.user.photoURL,
          emailVerified: req.user.emailVerified,
        },
      },
      "Token verified successfully",
    );
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Token verification failed", 401, error);
    }
  }
};

export const refreshUserData = async (req: Request, res: Response) => {
  try {
    if (!req.user?.uid) {
      throw new CustomError("User not authenticated", 401);
    }

    const user = await userService.syncUserFromFirebase(req.user.uid);
    sendSuccess(res, user, "User data refreshed successfully");
  } catch (error) {
    if (error instanceof CustomError) {
      sendError(res, error.message, error.statusCode, error);
    } else {
      sendError(res, "Failed to refresh user data", 500, error);
    }
  }
};

export const setCustomClaims = async (req: Request, res: Response) => {
  try {
    const { uid, customClaims } = req.body;

    if (!uid) {
      throw new CustomError("User UID is required", 400);
    }

    await firebaseAuth.setCustomUserClaims(uid, customClaims);

    logger.info(`Custom claims set for user: ${uid}`, { customClaims });
    sendSuccess(res, { uid, customClaims }, "Custom claims set successfully");
  } catch (error) {
    logger.error("Failed to set custom claims:", error);
    sendError(res, "Failed to set custom claims", 500, error);
  }
};

export const revokeRefreshTokens = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new CustomError("User UID is required", 400);
    }

    await firebaseAuth.revokeRefreshTokens(uid);

    logger.info(`Refresh tokens revoked for user: ${uid}`);
    sendSuccess(res, { uid }, "Refresh tokens revoked successfully");
  } catch (error) {
    logger.error("Failed to revoke refresh tokens:", error);
    sendError(res, "Failed to revoke refresh tokens", 500, error);
  }
};

export const deleteFirebaseUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      throw new CustomError("User UID is required", 400);
    }

    // Delete from Firebase
    await firebaseAuth.deleteUser(uid);

    // Delete from local database
    try {
      await userService.deleteUserByFirebaseUid(uid);
    } catch (dbError) {
      logger.warn(`User not found in local database: ${uid}`);
    }

    logger.info(`User deleted from Firebase and local database: ${uid}`);
    sendSuccess(res, { uid }, "User deleted successfully");
  } catch (error) {
    logger.error("Failed to delete user:", error);
    sendError(res, "Failed to delete user", 500, error);
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      throw new CustomError("Email is required", 400);
    }

    const firebaseUser = await firebaseAuth.getUserByEmail(email);
    const localUser = await userService.getUserByEmail(email);

    sendSuccess(
      res,
      {
        firebaseUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          disabled: firebaseUser.disabled,
          metadata: firebaseUser.metadata,
        },
        localUser,
      },
      "User retrieved successfully",
    );
  } catch (error) {
    logger.error("Failed to get user by email:", error);
    sendError(res, "Failed to get user by email", 404, error);
  }
};

export const createCustomToken = async (req: Request, res: Response) => {
  try {
    const { uid, additionalClaims } = req.body;

    if (!uid) {
      throw new CustomError("User UID is required", 400);
    }

    const customToken = await firebaseAuth.createCustomToken(
      uid,
      additionalClaims,
    );

    sendSuccess(res, { customToken }, "Custom token created successfully");
  } catch (error) {
    logger.error("Failed to create custom token:", error);
    sendError(res, "Failed to create custom token", 500, error);
  }
};
