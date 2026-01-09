// Database is optional - using in-memory storage instead
// This file is kept for compatibility but not required when using MemoryStorage

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Only initialize database if DATABASE_URL is provided
export let pool: pg.Pool | null = null;
export let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}
