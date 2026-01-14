import express from "express";
import multer from "multer";
import {
  addSoldier,
  getAllSoldiers,
  uploadSoldiersCSV,
} from "../controllers/soldierController";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/*
  RESTful structure:

  POST   /soldiers        -> Add single soldier (Medic/Admin)
  GET    /soldiers        -> Get all soldiers
  POST   /soldiers/upload -> Bulk upload via CSV (Admin)
*/

// ✅ Add Soldier (Medic / Admin)
router.post("/", addSoldier);

// ✅ Get all soldiers
router.get("/", getAllSoldiers);

// ✅ Upload CSV (Admin only feature)
router.post("/upload", upload.single("file"), uploadSoldiersCSV);

export default router;
