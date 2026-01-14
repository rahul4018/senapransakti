import { Request, Response } from "express";
import { db } from "../db";
import { soldiers, healthRecords, alerts } from "../db/schema";
import { desc, eq } from "drizzle-orm";

// 1. Dashboard Summary
export const getSummary = async (req: Request, res: Response) => {
  const allSoldiers = await db.select().from(soldiers);
  const allRecords = await db.select().from(healthRecords);
  const allAlerts = await db.select().from(alerts);

  let high = 0;
  let moderate = 0;
  let low = 0;

  for (const record of allRecords) {
    const hr = record.heartRate ?? 0;
    const spo2 = record.spo2 ?? 0;
    const temp = record.temperature ?? 0;

    let score = 0;
    if (hr < 50 || hr > 120) score++;
    if (spo2 < 92) score++;
    if (temp > 38) score++;

    if (score === 0) low++;
    else if (score === 1) moderate++;
    else high++;
  }

  res.json({
    totalSoldiers: allSoldiers.length,
    totalRecords: allRecords.length,
    highRisk: high,
    moderateRisk: moderate,
    lowRisk: low,
    totalAlerts: allAlerts.length,
  });
};

// 2. Soldier risk overview (latest health only)
export const getSoldiersRisk = async (req: Request, res: Response) => {
  const allSoldiers = await db.select().from(soldiers);
  const result: any[] = [];

  for (const s of allSoldiers) {
    const latest = await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.soldierId, s.id))
      .orderBy(desc(healthRecords.createdAt))
      .limit(1);

    let risk = "NO DATA";

    if (latest.length > 0) {
      const r = latest[0];
      const hr = r.heartRate ?? 0;
      const spo2 = r.spo2 ?? 0;
      const temp = r.temperature ?? 0;

      let score = 0;
      if (hr < 50 || hr > 120) score++;
      if (spo2 < 92) score++;
      if (temp > 38) score++;

      risk = score === 0 ? "LOW" : score === 1 ? "MODERATE" : "HIGH";
    }

    result.push({
      soldierId: s.id,
      name: s.name,
      unit: s.unit,
      latestRisk: risk,
    });
  }

  res.json(result);
};
