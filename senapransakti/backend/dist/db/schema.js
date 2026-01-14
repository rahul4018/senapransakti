"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alerts = exports.healthRecords = exports.soldiers = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).unique().notNull(),
    role: (0, pg_core_1.varchar)("role", { length: 50 }).notNull(),
});
exports.soldiers = (0, pg_core_1.pgTable)("soldiers", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    unit: (0, pg_core_1.varchar)("unit", { length: 255 }).notNull(),
});
exports.healthRecords = (0, pg_core_1.pgTable)("health_records", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    soldierId: (0, pg_core_1.integer)("soldier_id").notNull(),
    heartRate: (0, pg_core_1.integer)("heart_rate"),
    spo2: (0, pg_core_1.integer)("spo2"),
    temperature: (0, pg_core_1.integer)("temperature"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.alerts = (0, pg_core_1.pgTable)("alerts", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    soldierId: (0, pg_core_1.integer)("soldier_id").notNull(),
    level: (0, pg_core_1.varchar)("level", { length: 50 }),
    message: (0, pg_core_1.varchar)("message", { length: 500 }),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
