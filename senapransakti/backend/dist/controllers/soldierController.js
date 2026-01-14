"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSoldiersCSV = exports.getAllSoldiers = exports.addSoldier = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
// =======================
// Add Single Soldier
// =======================
const addSoldier = async (req, res) => {
    try {
        const { name, unit } = req.body;
        if (!name || !unit) {
            return res.status(400).json({ message: "Name and unit are required" });
        }
        const inserted = await db_1.db
            .insert(schema_1.soldiers)
            .values({ name, unit })
            .returning();
        res.json({
            message: "Soldier added successfully",
            soldier: inserted[0],
        });
    }
    catch (err) {
        console.error("Add soldier error:", err);
        res.status(500).json({ message: "Failed to add soldier" });
    }
};
exports.addSoldier = addSoldier;
// =======================
// Get All Soldiers
// =======================
const getAllSoldiers = async (_req, res) => {
    try {
        const data = await db_1.db.select().from(schema_1.soldiers);
        res.json(data);
    }
    catch (err) {
        console.error("Get soldiers error:", err);
        res.status(500).json({ message: "Failed to fetch soldiers" });
    }
};
exports.getAllSoldiers = getAllSoldiers;
// =======================
// Upload Soldiers CSV
// =======================
const uploadSoldiersCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "CSV file required" });
        }
        const results = [];
        fs_1.default.createReadStream(req.file.path)
            .pipe((0, csv_parser_1.default)())
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
                await db_1.db.insert(schema_1.soldiers).values(results);
            }
            // Delete uploaded file after processing
            fs_1.default.unlinkSync(req.file.path);
            res.json({
                message: "CSV uploaded successfully",
                inserted: results.length,
            });
        })
            .on("error", (err) => {
            console.error("CSV parse error:", err);
            res.status(500).json({ message: "CSV processing failed" });
        });
    }
    catch (err) {
        console.error("Upload CSV error:", err);
        res.status(500).json({ message: "Failed to upload CSV" });
    }
};
exports.uploadSoldiersCSV = uploadSoldiersCSV;
