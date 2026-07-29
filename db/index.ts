import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
  ssl: process.env.DB_CA_CERT
    ? {
        rejectUnauthorized: true,
        ca: process.env.DB_CA_CERT,
      }
    : {
        rejectUnauthorized: false,
      },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export const db = drizzle(pool, { schema });
