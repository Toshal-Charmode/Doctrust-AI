import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export interface AppConfig {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  geminiApiKey: string;
  maxFileSizeMb: number;
  frontendUrl: string;
  uploadDir: string;
}

function getEnvOrThrow(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value && value !== '') {
    throw new Error(`[Config Error] Missing required environment variable: ${key}`);
  }
  return value;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: getEnvOrThrow('JWT_SECRET', 'docutrust_secure_jwt_secret_key_hackathon_2026_dev'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  uploadDir: path.resolve(__dirname, '../../uploads'),
};

export function validateEnvironment(): void {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET environment variable must be defined.');
  }

  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️  [Warning] GEMINI_API_KEY is not set. Intelligent heuristic engine will handle document extraction.');
  } else {
    console.log('✓ Google Gemini API is configured with official @google/genai SDK');
  }
}

export default config;
