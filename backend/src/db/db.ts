import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.racgtmmxdfypubkbobxj:VeymorMail892004%24%24@aws-1-ap-south-1.pooler.supabase.com:6543/postgres',
});

export const db = drizzle(pool);