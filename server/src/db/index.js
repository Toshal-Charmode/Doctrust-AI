import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { PGlite } from '@electric-sql/pglite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dbClient = null;
let isPgPool = false;

export async function initDatabase() {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (databaseUrl) {
    try {
      console.log('Connecting to PostgreSQL via DATABASE_URL...');
      const pool = new pg.Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      // Test connection
      const client = await pool.connect();
      client.release();
      dbClient = pool;
      isPgPool = true;
      console.log('✓ Successfully connected to external PostgreSQL / Supabase database');
    } catch (err) {
      console.warn('Could not connect to external PostgreSQL, falling back to embedded PGlite:', err.message);
      isPgPool = false;
    }
  }

  if (!dbClient) {
    console.log('Initializing embedded PostgreSQL (PGlite)...');
    const dataDir = path.resolve(__dirname, '../../data/postgres');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    dbClient = new PGlite(dataDir);
    console.log(`✓ Embedded PostgreSQL initialized with data directory: ${dataDir}`);
  }

  // Execute schema DDL
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    if (isPgPool) {
      await dbClient.query(schemaSql);
    } else {
      await dbClient.exec(schemaSql);
    }
    console.log('✓ Database schema tables and indexes verified successfully');
  } catch (err) {
    console.error('Error applying database schema:', err);
    throw err;
  }

  return dbClient;
}

export async function query(text, params = []) {
  if (!dbClient) {
    await initDatabase();
  }

  try {
    if (isPgPool) {
      const result = await dbClient.query(text, params);
      return result;
    } else {
      // PGlite query
      const result = await dbClient.query(text, params);
      return result;
    }
  } catch (error) {
    console.error(`Database query error: ${error.message} \nQuery: ${text}`);
    throw error;
  }
}

export function getClient() {
  return dbClient;
}

export default {
  initDatabase,
  query,
  getClient,
};
