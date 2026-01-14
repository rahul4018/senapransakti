import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/authRoutes";
import soldierRoutes from "./routes/soldierRoutes";
import healthRoutes from "./routes/healthRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import alertRoutes from "./routes/alertRoutes";
import chatRoutes from "./routes/chatRoutes";
import digitalTwinRoutes from "./routes/digitalTwinRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();

// ============================
// Middleware
// ============================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ============================
// Health Check
// ============================
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Senapransakti Backend Running Successfully");
});

// ============================
// API Routes
// ============================
app.use("/auth", authRoutes);
app.use("/soldiers", soldierRoutes);
app.use("/health", healthRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/alerts", alertRoutes);
app.use("/chat", chatRoutes);
app.use("/digital-twin", digitalTwinRoutes);
app.use("/ai", aiRoutes);

// ============================
// 404 Fallback
// ============================
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ============================
// Global Error Handler
// ============================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("🔥 Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// ============================
// Server Start
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
