import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// CORS configuration
export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all origins
    if (process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    // In production, define allowed origins
    const allowedOrigins = [
      "https://yourdomain.com",
      "https://www.yourdomain.com",
      // Add your production domains here
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Rate limiting configuration
export const createRateLimit = (
  windowMs: number,
  max: number,
  message?: string,
) => {
  return rateLimit({
    windowMs,
    max,
    message:
      message || "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });
};

// General rate limit - 100 requests per 15 minutes
export const generalRateLimit = createRateLimit(15 * 60 * 1000, 100);

// Strict rate limit for sensitive endpoints - 5 requests per 15 minutes
export const strictRateLimit = createRateLimit(
  15 * 60 * 1000,
  5,
  "Too many attempts, please try again later.",
);

// API rate limit - 1000 requests per hour
export const apiRateLimit = createRateLimit(60 * 60 * 1000, 1000);

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for API usage
});

// Security middleware to add custom headers
export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Remove server information
  res.removeHeader("X-Powered-By");

  // Add custom security headers
  res.setHeader("X-API-Version", "1.0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
};
