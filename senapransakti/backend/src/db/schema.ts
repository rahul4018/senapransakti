import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  role: varchar("role", { length: 50 }).notNull(),
});

export const soldiers = pgTable("soldiers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  unit: varchar("unit", { length: 255 }).notNull(),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  soldierId: integer("soldier_id").notNull(),
  heartRate: integer("heart_rate"),
  spo2: integer("spo2"),
  temperature: integer("temperature"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  soldierId: integer("soldier_id").notNull(),
  level: varchar("level", { length: 50 }),
  message: varchar("message", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});
