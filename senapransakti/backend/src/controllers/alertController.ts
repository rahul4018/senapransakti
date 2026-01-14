import { Request, Response } from "express";
import { db } from "../db";
import { alerts } from "../db/schema";

export const getAllAlerts = async (req: Request, res: Response) => {
  const data = await db.select().from(alerts);
  res.json(data);
};
