"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoldiersRisk = exports.getSummary = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// 1. Dashboard Summary
const getSummary = async (req, res) => {
    const allSoldiers = await db_1.db.select().from(schema_1.soldiers);
    const allRecords = await db_1.db.select().from(schema_1.healthRecords);
    const allAlerts = await db_1.db.select().from(schema_1.alerts);
    let high = 0;
    let moderate = 0;
    let low = 0;
    for (const record of allRecords) {
        const hr = record.heartRate ?? 0;
        const spo2 = record.spo2 ?? 0;
        const temp = record.temperature ?? 0;
        let score = 0;
        if (hr < 50 || hr > 120)
            score++;
        if (spo2 < 92)
            score++;
        if (temp > 38)
            score++;
        if (score === 0)
            low++;
        else if (score === 1)
            moderate++;
        else
            high++;
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
exports.getSummary = getSummary;
// 2. Soldier risk overview (latest health only)
const getSoldiersRisk = async (req, res) => {
    const allSoldiers = await db_1.db.select().from(schema_1.soldiers);
    const result = [];
    for (const s of allSoldiers) {
        const latest = await db_1.db
            .select()
            .from(schema_1.healthRecords)
            .where((0, drizzle_orm_1.eq)(schema_1.healthRecords.soldierId, s.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.healthRecords.createdAt))
            .limit(1);
        let risk = "NO DATA";
        if (latest.length > 0) {
            const r = latest[0];
            const hr = r.heartRate ?? 0;
            const spo2 = r.spo2 ?? 0;
            const temp = r.temperature ?? 0;
            let score = 0;
            if (hr < 50 || hr > 120)
                score++;
            if (spo2 < 92)
                score++;
            if (temp > 38)
                score++;
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
exports.getSoldiersRisk = getSoldiersRisk;
