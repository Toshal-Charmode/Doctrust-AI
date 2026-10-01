import { seedDemoDataForUser } from '../services/documents/sampleDocs.js';
import { isGeminiConfigured } from '../config/gemini.js';
import config from '../config/env.js';

export async function seedDemo(req, res, next) {
  try {
    const userId = req.user.id;
    const seeded = await seedDemoDataForUser(userId);

    return res.status(201).json({
      success: true,
      message: `Demo mode active: Loaded ${seeded.length} realistic procurement documents and completed 3-way match validation!`,
      data: {
        documents: seeded,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSystemStatus(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: {
        geminiConfigured: isGeminiConfigured(),
        confidenceThreshold: config.confidenceThreshold,
        model: 'gemini-2.5-flash',
        storage: 'PostgreSQL',
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateApiKey(req, res, next) {
  try {
    const { apiKey } = req.body;
    if (apiKey && typeof apiKey === 'string') {
      config.geminiApiKey = apiKey.trim();
    }

    return res.status(200).json({
      success: true,
      message: 'Gemini API key updated for current server session',
      data: {
        geminiConfigured: isGeminiConfigured(),
      },
    });
  } catch (error) {
    next(error);
  }
}

export default {
  seedDemo,
  getSystemStatus,
  updateApiKey,
};
