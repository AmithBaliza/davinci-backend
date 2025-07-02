import cors from "cors";
import express from "express";
import logger from "./config/logger";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import {
  apiRateLimit,
  corsOptions,
  helmetConfig,
  securityHeaders,
} from "./middlewares/security";
import culturalExhibitRoutes from "./modules/culturalExhibit/culturalExhibit.routes";
import culturalPieceRoutes from "./modules/culturalPiece/culturalPiece.routes";
import exhibitItineraryRoutes from "./modules/exhibitItinerary/exhibitItinerary.routes";
import exhibitSpaceRoutes from "./modules/exhibitSpace/exhibitSpace.routes";
import levelRoutes from "./modules/level/level.routes";
import ticketRoutes from "./modules/ticket/ticket.routes";

const app = express();

// Security middleware (order matters)
app.use(helmetConfig);
app.use(cors(corsOptions));
app.use(securityHeaders);
app.use(apiRateLimit);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
    );
  });
  next();
});

// API Routes
app.use("/api/cultural-exhibits", culturalExhibitRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/exhibit-spaces", exhibitSpaceRoutes);
app.use("/api/cultural-pieces", culturalPieceRoutes);
app.use("/api/exhibit-itineraries", exhibitItineraryRoutes);
app.use("/api/tickets", ticketRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
