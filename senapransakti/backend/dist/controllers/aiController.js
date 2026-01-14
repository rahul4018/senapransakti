"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSoldierAI = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const getSoldierAI = async (req, res) => {
    try {
        const id = Number(req.params.id);
        // Get soldier
        const soldier = await db_1.db.query.soldiers.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.soldiers.id, id),
        });
        if (!soldier) {
            return res.status(404).json({ message: "Soldier not found" });
        }
        // Get latest health record
        const latest = await db_1.db.query.healthRecords.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.healthRecords.soldierId, id),
            orderBy: (0, drizzle_orm_1.desc)(schema_1.healthRecords.createdAt),
        });
        if (!latest || latest.heartRate == null || latest.spo2 == null || latest.temperature == null) {
            return res.json({
                risk: "UNKNOWN",
                summary: "Not enough health data to generate AI analysis.",
                recommendations: ["Collect more health records for accurate analysis."],
            });
        }
        const { heartRate, spo2, temperature } = latest;
        // 🧠 AI-like reasoning logic
        let risk = "LOW";
        const recommendations = [];
        if (heartRate > 120 || spo2 < 90 || temperature > 38) {
            risk = "HIGH";
            recommendations.push("Immediate medical evaluation required.");
            recommendations.push("Reduce physical activity.");
            recommendations.push("Monitor vitals continuously.");
        }
        else if (heartRate > 100 || spo2 < 94 || temperature > 37.5) {
            risk = "MODERATE";
            recommendations.push("Rest recommended.");
            recommendations.push("Recheck vitals after 30 minutes.");
        }
        else {
            recommendations.push("Vitals stable. Maintain hydration.");
            recommendations.push("Continue routine monitoring.");
        }
        const summary = `
      Soldier ${soldier.name} currently shows ${risk.toLowerCase()} health risk.
      Heart rate is ${heartRate} bpm, SpO2 is ${spo2}%, and temperature is ${temperature}°C.
      Overall condition is ${risk === "HIGH" ? "concerning" : risk === "MODERATE" ? "slightly elevated" : "stable"}.
    `;
        res.json({
            risk,
            summary: summary.trim(),
            recommendations,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI processing failed" });
    }
};
exports.getSoldierAI = getSoldierAI;
