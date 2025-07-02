import express from "express";
import culturalExhibitRoutes from "./modules/culturalExhibit/culturalExhibit.routes";

const app = express();

// Middleware
app.use(express.json());

// API Routes
app.use("/api/cultural-exhibits", culturalExhibitRoutes);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
