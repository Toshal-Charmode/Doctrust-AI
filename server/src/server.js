import app from './app.js';
import config from './config/env.js';
import { initDatabase } from './db/index.js';
import { isGeminiConfigured } from './config/gemini.js';

async function startServer() {
  try {
    console.log('--- Initializing DocuTrust AI Backend ---');
    console.log(`Environment: ${config.nodeEnv}`);

    // Initialize Database
    await initDatabase();

    // Check Gemini API status
    if (isGeminiConfigured()) {
      console.log('✓ Google Gemini API is configured and ready');
    } else {
      console.log('ℹ Google Gemini API key not set in .env. High-fidelity heuristic engine is active for demo.');
    }

    // Start Express listener
    app.listen(config.port, () => {
      console.log(`✓ DocuTrust AI Server running at http://localhost:${config.port}`);
      console.log(`✓ API Healthcheck available at http://localhost:${config.port}/api/health`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
}

startServer();
