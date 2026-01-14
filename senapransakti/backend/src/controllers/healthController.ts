import { Request, Response } from "express";
import { db } from "../db";
import { healthRecords, alerts } from "../db/schema";
import fs from "fs";
import csv from "csv-parser";
import { eq } from "drizzle-orm";

// ------------------
// Risk logic
// ------------------
function calculateRisk(hr: number, spo2: number, temp: number) {
  let score = 0;

  if (hr < 50 || hr > 120) score++;
  if (spo2 < 92) score++;
  if (temp > 38) score++;

  if (score === 0) return "LOW";
  if (score === 1) return "MODERATE";
  return "HIGH";
}

// ------------------
// Add single health record (Medic / Admin)
// ------------------
export const addHealthRecord = async (req: Request, res: Response) => {
  try {
    const { soldierId, heart_rate, spo2, temperature } = req.body;

    if (!soldierId || !heart_rate || !spo2 || !temperature) {
      return res.status(400).json({ message: "All fields required" });
    }

    const hr = Number(heart_rate);
    const s = Number(spo2);
    const temp = Math.round(Number(temperature));

    if (isNaN(hr) || isNaN(s) || isNaN(temp)) {
      return res.status(400).json({ message: "Invalid numeric values" });
    }

    const risk = calculateRisk(hr, s, temp);

    // Insert health
    await db.insert(healthRecords).values({
      soldierId: Number(soldierId),
      heartRate: hr,
      spo2: s,
      temperature: temp,
    });

    // Create alert if HIGH
    if (risk === "HIGH") {
      await db.insert(alerts).values({
        soldierId: Number(soldierId),
        level: "HIGH",
        message: "Critical health risk detected (manual entry)",
      });
    }

    res.json({
      message: "Health record added successfully",
      risk,
    });
  } catch (err) {
    console.error("Add health error:", err);
    res.status(500).json({ message: "Failed to add health record" });
  }
};

// ------------------
// Upload CSV
// ------------------
export const uploadHealthCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const results: any[] = [];
    let alertsCreated = 0;

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const soldierId = Number(row.soldierId);
        const heartRate = Number(row.heartRate);
        const spo2 = Number(row.spo2);
        const temperature = Math.round(Number(row.temperature));

        if (
          !isNaN(soldierId) &&
          !isNaN(heartRate) &&
          !isNaN(spo2) &&
          !isNaN(temperature)
        ) {
          results.push({ soldierId, heartRate, spo2, temperature });
        }
      })
      .on("end", async () => {
        for (const record of results) {
          const risk = calculateRisk(
            record.heartRate,
            record.spo2,
            record.temperature
          );

          await db.insert(healthRecords).values(record);

          if (risk === "HIGH") {
            await db.insert(alerts).values({
              soldierId: record.soldierId,
              level: "HIGH",
              message: "Critical health risk detected (CSV upload)",
            });
            alertsCreated++;
          }
        }

        fs.unlinkSync(req.file!.path);

        res.json({
          message: "Health CSV processed successfully",
          recordsInserted: results.length,
          alertsGenerated: alertsCreated,
        });
      });
  } catch (err) {
    console.error("CSV upload error:", err);
    res.status(500).json({ message: "Failed to process CSV" });
  }
};

// ------------------
// Get all health records
// ------------------
export const getAllHealth = async (_req: Request, res: Response) => {
  try {
    const records = await db.select().from(healthRecords);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch health records" });
  }
};

// ------------------
// Get health by soldierId
// ------------------
export const getHealthBySoldier = async (req: Request, res: Response) => {
  try {
    const soldierId = Number(req.params.soldierId);

    const records = await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.soldierId, soldierId));

    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch soldier health" });
  }
};
