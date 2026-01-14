import { Request, Response } from "express";
import { db } from "../db";
import { soldiers } from "../db/schema";
import fs from "fs";
import csv from "csv-parser";

// =======================
// Add Single Soldier
// =======================
export const addSoldier = async (req: Request, res: Response) => {
  try {
    const { name, unit } = req.body;

    if (!name || !unit) {
      return res.status(400).json({ message: "Name and unit are required" });
    }

    const inserted = await db
      .insert(soldiers)
      .values({ name, unit })
      .returning();

    res.json({
      message: "Soldier added successfully",
      soldier: inserted[0],
    });
  } catch (err) {
    console.error("Add soldier error:", err);
    res.status(500).json({ message: "Failed to add soldier" });
  }
};

// =======================
// Get All Soldiers
// =======================
export const getAllSoldiers = async (_req: Request, res: Response) => {
  try {
    const data = await db.select().from(soldiers);
    res.json(data);
  } catch (err) {
    console.error("Get soldiers error:", err);
    res.status(500).json({ message: "Failed to fetch soldiers" });
  }
};

// =======================
// Upload Soldiers CSV
// =======================
export const uploadSoldiersCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const results: { name: string; unit: string }[] = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        if (row.name && row.unit) {
          results.push({
            name: String(row.name).trim(),
            unit: String(row.unit).trim(),
          });
        }
      })
      .on("end", async () => {
        if (results.length > 0) {
          await db.insert(soldiers).values(results);
        }

        // Delete uploaded file after processing
        fs.unlinkSync(req.file!.path);

        res.json({
          message: "CSV uploaded successfully",
          inserted: results.length,
        });
      })
      .on("error", (err) => {
        console.error("CSV parse error:", err);
        res.status(500).json({ message: "CSV processing failed" });
      });
  } catch (err) {
    console.error("Upload CSV error:", err);
    res.status(500).json({ message: "Failed to upload CSV" });
  }
};
