import fs from 'fs';
import pdfParse from 'pdf-parse';
import { GoogleGenAI } from '@google/genai';
import config from '../../config/env.js';
import logger from '../../utils/logger.js';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return geminiClient;
}

export function cleanJsonResponse(rawText: string): string {
  if (!rawText) return '{}';
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  return cleaned.trim();
}

export async function extractDocumentRawText(filePath: string, mimeType: string): Promise<string> {
  try {
    if (mimeType === 'application/pdf') {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text || '';
    }
  } catch (err: any) {
    logger.warn(`PDF text extraction note for ${filePath}: ${err.message}`);
  }
  return '';
}

export default {
  getGeminiClient,
  cleanJsonResponse,
  extractDocumentRawText,
};
