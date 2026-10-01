import { GoogleGenAI } from '@google/genai';
import config from './env.js';

let geminiClient = null;

export function getGeminiClient(customApiKey = null) {
  const key = customApiKey || config.geminiApiKey;
  if (!key || key === 'your_gemini_api_key_here') {
    return null;
  }

  if (!geminiClient || customApiKey) {
    geminiClient = new GoogleGenAI({ apiKey: key });
  }

  return geminiClient;
}

export function isGeminiConfigured() {
  const key = config.geminiApiKey;
  return Boolean(key && key !== 'your_gemini_api_key_here' && key.trim().length > 10);
}

export default {
  getGeminiClient,
  isGeminiConfigured,
};
