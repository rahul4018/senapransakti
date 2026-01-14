"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthBySoldier = exports.getAllHealth = exports.uploadHealthCSV = exports.addHealthRecord = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const drizzle_orm_1 = require("drizzle-orm");
// ------------------
// Risk logic
// ------------------
function calculateRisk(hr, spo2, temp) {
    let score = 0;
    if (hr < 50 || hr > 120)
        score++;
    if (spo2 < 92)
        score++;
    if (temp > 38)
        score++;
    if (score === 0)
        return "LOW";
    if (score === 1)
        return "MODERATE";
    return "HIGH";
}
// ------------------
// Add single health record (Medic / Admin)
// ------------------
const addHealthRecord = async (req, res) => {
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
        await db_1.db.insert(schema_1.healthRecords).values({
            soldierId: Number(soldierId),
            heartRate: hr,
            spo2: s,
            temperature: temp,
        });
        // Create alert if HIGH
        if (risk === "HIGH") {
            await db_1.db.insert(schema_1.alerts).values({
                soldierId: Number(soldierId),
                level: "HIGH",
                message: "Critical health risk detected (manual entry)",
            });
        }
        res.json({
            message: "Health record added successfully",
            risk,
        });
    }
    catch (err) {
        console.error("Add health error:", err);
        res.status(500).json({ message: "Failed to add health record" });
    }
};
exports.addHealthRecord = addHealthRecord;
// ------------------
// Upload CSV
// ------------------
const uploadHealthCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "CSV file required" });
        }
        const results = [];
        let alertsCreated = 0;
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
            .on("data", (row) => {
            const soldierId = Number(row.soldierId);
            const heartRate = Number(row.heartRate);
            const spo2 = Number(row.spo2);
            const temperature = Math.round(Number(row.temperature));
            if (!isNaN(soldierId) &&
                !isNaN(heartRate) &&
                !isNaN(spo2) &&
                !isNaN(temperature)) {
                results.push({ soldierId, heartRate, spo2, temperature });
            }
        })
            .on("end", async () => {
            for (const record of results) {
                const risk = calculateRisk(record.heartRate, record.spo2, record.temperature);
                await db_1.db.insert(schema_1.healthRecords).values(record);
                if (risk === "HIGH") {
                    await db_1.db.insert(schema_1.alerts).values({
                        soldierId: record.soldierId,
                        level: "HIGH",
                        message: "Critical health risk detected (CSV upload)",
                    });
                    alertsCreated++;
                }
            }
            fs_1.default.unlinkSync(req.file.path);
            res.json({
                message: "Health CSV processed successfully",
                recordsInserted: results.length,
                alertsGenerated: alertsCreated,
            });
        });
    }
    catch (err) {
        console.error("CSV upload error:", err);
        res.status(500).json({ message: "Failed to process CSV" });
    }
};
exports.uploadHealthCSV = uploadHealthCSV;
// ------------------
// Get all health records
// ------------------
const getAllHealth = async (_req, res) => {
    try {
        const records = await db_1.db.select().from(schema_1.healthRecords);
        res.json(records);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch health records" });
    }
};
exports.getAllHealth = getAllHealth;
// ------------------
// Get health by soldierId
// ------------------
const getHealthBySoldier = async (req, res) => {
    try {
        const soldierId = Number(req.params.soldierId);
        const records = await db_1.db
            .select()
            .from(schema_1.healthRecords)
            .where((0, drizzle_orm_1.eq)(schema_1.healthRecords.soldierId, soldierId));
        res.json(records);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch soldier health" });
    }
};
exports.getHealthBySoldier = getHealthBySoldier;
