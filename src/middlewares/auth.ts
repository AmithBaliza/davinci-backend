import { NextFunction, Request, Response } from "express";
import { firebaseAuth } from "../config/firebase";
import logger from "../config/logger";
import { sendError } from "../utils/responseHandler";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        displayName?: string;
        photoURL?: string;
        emailVerified: boolean;
        customClaims?: Record<string, any>;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendError(res, "Authorization header is required", 401);
    }

    const token = authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return sendError(res, "Token is required", 401);
    }

    // Verify the Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // Get additional user info from Firebase Auth
    const userRecord = await firebaseAuth.getUser(decodedToken.uid);

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      customClaims: decodedToken,
    };

    logger.info(`User authenticated: ${req.user.uid}`);
    next();
  } catch (error: any) {
    logger.error("Authentication error:", error);

    if (error.code === "auth/id-token-expired") {
      return sendError(res, "Token has expired", 401);
    }

    if (error.code === "auth/id-token-revoked") {
      return sendError(res, "Token has been revoked", 401);
    }

    if (error.code === "auth/invalid-id-token") {
      return sendError(res, "Invalid token", 401);
    }

    return sendError(res, "Authentication failed", 401);
  }
};

// Optional middleware for routes that can work with or without authentication
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(); // Continue without authentication
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(); // Continue without authentication
    }

    // Try to verify the token
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const userRecord = await firebaseAuth.getUser(decodedToken.uid);

    req.user = {
      uid: decodedToken.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      customClaims: decodedToken,
    };

    logger.info(`Optional auth - User authenticated: ${req.user.uid}`);
  } catch (error) {
    logger.warn(
      "Optional auth failed, continuing without authentication:",
      error,
    );
  }

  next();
};

// Middleware to check if user has specific custom claims/roles
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    const userRoles = req.user.customClaims?.roles || [];

    if (!userRoles.includes(requiredRole)) {
      return sendError(res, "Insufficient permissions", 403);
    }

    next();
  };
};
