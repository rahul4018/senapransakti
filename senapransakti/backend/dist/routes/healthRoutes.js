"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const healthController_1 = require("../controllers/healthController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
// Add manual health record
router.post("/add", healthController_1.addHealthRecord);
// Upload CSV file
router.post("/upload", upload.single("file"), healthController_1.uploadHealthCSV);
// Get all health records
router.get("/", healthController_1.getAllHealth);
// Get by soldier ID
router.get("/:soldierId", healthController_1.getHealthBySoldier);
exports.default = router;
