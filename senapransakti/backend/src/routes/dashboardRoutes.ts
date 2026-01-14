import express from "express";
import { getSummary, getSoldiersRisk } from "../controllers/dashboardController";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/soldiers-risk", getSoldiersRisk);

export default router;
