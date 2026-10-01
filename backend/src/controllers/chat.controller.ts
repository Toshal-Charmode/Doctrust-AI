import { Request, Response, NextFunction } from 'express';
import { askAiAssistant } from '../services/ai/chat.service.js';
import { chatRequestSchema } from '../schemas/chat.schema.js';
import { sendSuccess } from '../utils/apiResponse.js';

export async function askQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const validated = chatRequestSchema.parse(req.body);

    const answer = await askAiAssistant(userId, validated.question);

    sendSuccess(res, { answer });
  } catch (err) {
    next(err);
  }
}

export default {
  askQuestion,
};
