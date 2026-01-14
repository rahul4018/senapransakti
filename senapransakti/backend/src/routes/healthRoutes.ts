import { Router } from "express";
import multer from "multer";
import {
  addHealthRecord,
  uploadHealthCSV,
  getAllHealth,
  getHealthBySoldier,
} from "../controllers/healthController";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Add manual health record
router.post("/add", addHealthRecord);

// Upload CSV file
router.post("/upload", upload.single("file"), uploadHealthCSV);

// Get all health records
router.get("/", getAllHealth);

// Get by soldier ID
router.get("/:soldierId", getHealthBySoldier);

export default router;
