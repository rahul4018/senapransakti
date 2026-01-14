"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDigitalTwin = void 0;
const db_1 = require("../db");
const getDigitalTwin = async (req, res) => {
    try {
        const soldierId = Number(req.params.id);
        if (!soldierId) {
            return res.status(400).json({ message: "Invalid soldier ID" });
        }
        const soldier = await db_1.pool.query("SELECT * FROM soldiers WHERE id = $1", [soldierId]);
        if (soldier.rows.length === 0) {
            return res.status(404).json({ message: "Soldier not found" });
        }
        const records = await db_1.pool.query(`SELECT heart_rate, spo2, temperature, created_at
       FROM health_records
       WHERE soldier_id = $1
       ORDER BY created_at DESC
       LIMIT 50`, [soldierId]);
        res.json({
            soldier: soldier.rows[0],
            records: records.rows,
        });
    }
    catch (err) {
        console.error("Digital twin error:", err);
        res.status(500).json({ message: "Failed to load digital twin" });
    }
};
exports.getDigitalTwin = getDigitalTwin;
