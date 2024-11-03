import { env } from '@/data/server';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql });
