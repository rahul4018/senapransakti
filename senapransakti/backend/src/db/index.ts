import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// ✅ EXPORT pool so controllers can import it
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Existing drizzle export
export const db = drizzle(pool, { schema });
