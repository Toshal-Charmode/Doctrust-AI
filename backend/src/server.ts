import config from './config/env.js';
import { initDb } from './config/database.js';
import { runMigrations } from './db/index.js';
import { createApp } from './app.js';
import logger from './utils/logger.js';

async function bootstrap() {
  try {
    logger.info('====================================================');
    logger.info('  DocuTrust AI - Enterprise Backend Engine');
    logger.info('====================================================');
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Port: ${config.port}`);

    if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
      logger.warn('⚠️  GEMINI_API_KEY is not configured or using placeholder. AI processing will operate with deterministic fallback engine.');
    } else {
      logger.info('✅ Google Gemini API client initialized.');
    }

    // Initialize Database
    logger.info('Initializing PostgreSQL database...');
    await initDb();

    // Run Migrations
    logger.info('Applying database migrations...');
    await runMigrations();
    logger.info('✅ Database schema verified and up to date.');

    // Create Express App
    const app = createApp();

    const server = app.listen(config.port, () => {
      logger.info(`🚀 DocuTrust AI Backend listening on http://localhost:${config.port}`);
      logger.info(`🔍 Health check: http://localhost:${config.port}/api/health`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      logger.info('Received termination signal. Gracefully shutting down...');
      server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err: any) {
    logger.error(`Critical server initialization failure: ${err.message}`);
    process.exit(1);
  }
}

bootstrap();
