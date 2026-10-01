import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';
import config from './env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbClient: any = null;
let isPgPool = false;

export interface QueryResult<T = any> {
  rows: T[];
  rowCount?: number;
}

export async function initDatabase(): Promise<any> {
  const databaseUrl = config.databaseUrl.trim();

  if (databaseUrl) {
    try {
      console.log('Connecting to PostgreSQL / Supabase via DATABASE_URL...');
      const isRemoteOrSupabase = databaseUrl.includes('supabase') || databaseUrl.includes('.com') || databaseUrl.includes('sslmode') || config.nodeEnv === 'production';
      const pool = new pg.Pool({
        connectionString: databaseUrl,
        ssl: isRemoteOrSupabase ? { rejectUnauthorized: false } : false,
      });

      const client = await pool.connect();
      client.release();
      dbClient = pool;
      isPgPool = true;
      console.log('✓ Successfully connected to Supabase / PostgreSQL database');
    } catch (err: any) {
      console.warn(`Could not connect to external PostgreSQL (${err.message}). Falling back to embedded PostgreSQL.`);
      isPgPool = false;
    }
  }

  if (!dbClient) {
    const dataDir = path.resolve(__dirname, '../../data/postgres');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dbClient = new PGlite(dataDir);
    console.log(`✓ Embedded PostgreSQL (PGlite) active at ${dataDir}`);
  }

  // Run Migration
  const migrationPath = path.resolve(__dirname, '../db/migrations/001_initial_schema.sql');
  if (fs.existsSync(migrationPath)) {
    const schemaSql = fs.readFileSync(migrationPath, 'utf8');
    if (isPgPool) {
      await dbClient.query(schemaSql);
    } else {
      await dbClient.exec(schemaSql);
    }
    console.log('✓ Initial schema migrations verified successfully');
  }

  return dbClient;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
  if (!dbClient) {
    await initDatabase();
  }

  try {
    if (isPgPool) {
      const result = await dbClient.query(sql, params);
      return {
        rows: result.rows as T[],
        rowCount: result.rowCount || result.rows.length,
      };
    } else {
      const result = await dbClient.query(sql, params);
      return {
        rows: result.rows as T[],
        rowCount: result.rows ? result.rows.length : 0,
      };
    }
  } catch (error: any) {
    console.error(`[Database Error] ${error.message}\nQuery: ${sql}`);
    throw error;
  }
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const res = await query('SELECT 1 as alive;');
    return res.rows.length > 0;
  } catch {
    return false;
  }
}

export const initDb = initDatabase;
export const checkDbHealth = checkDatabaseConnection;

export const runMigrations = async () => {
  const migrationPath = path.resolve(__dirname, '../db/migrations/001_initial_schema.sql');
  if (fs.existsSync(migrationPath)) {
    const schemaSql = fs.readFileSync(migrationPath, 'utf8');
    if (isPgPool) {
      await dbClient.query(schemaSql);
    } else {
      await dbClient.exec(schemaSql);
    }
  }
};

export default {
  initDatabase,
  initDb,
  query,
  checkDatabaseConnection,
  checkDbHealth,
  runMigrations,
};

