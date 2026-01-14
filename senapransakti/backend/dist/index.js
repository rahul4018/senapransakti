"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const soldierRoutes_1 = __importDefault(require("./routes/soldierRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const alertRoutes_1 = __importDefault(require("./routes/alertRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const digitalTwinRoutes_1 = __importDefault(require("./routes/digitalTwinRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// ============================
// Middleware
// ============================
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
// ============================
// Health Check
// ============================
app.get("/", (_req, res) => {
    res.send("🚀 Senapransakti Backend Running Successfully");
});
// ============================
// API Routes
// ============================
app.use("/auth", authRoutes_1.default);
app.use("/soldiers", soldierRoutes_1.default);
app.use("/health", healthRoutes_1.default);
app.use("/dashboard", dashboardRoutes_1.default);
app.use("/alerts", alertRoutes_1.default);
app.use("/chat", chatRoutes_1.default);
app.use("/digital-twin", digitalTwinRoutes_1.default);
app.use("/ai", aiRoutes_1.default);
// ============================
// 404 Fallback
// ============================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        path: req.originalUrl,
    });
});
// ============================
// Global Error Handler
// ============================
app.use((err, _req, res, _next) => {
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
