import express from "express";
import { getAllAlerts } from "../controllers/alertController";

const router = express.Router();

router.get("/", getAllAlerts);

export default router;
