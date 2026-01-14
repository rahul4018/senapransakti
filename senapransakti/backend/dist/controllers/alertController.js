"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAlerts = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const getAllAlerts = async (req, res) => {
    const data = await db_1.db.select().from(schema_1.alerts);
    res.json(data);
};
exports.getAllAlerts = getAllAlerts;
