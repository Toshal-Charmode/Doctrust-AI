import { Request, Response, NextFunction } from 'express';
import validationService from '../services/validation/validation.service.js';
import { generateValidationExplanation } from '../services/ai/explanation.service.js';
import { validationCompareSchema } from '../schemas/validation.schema.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export async function compareDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const validatedBody = validationCompareSchema.parse(req.body);

    const result = await validationService.validateDocuments(userId, validatedBody.documentIds);
    sendSuccess(res, result, 'Cross-document reconciliation completed', 201);
  } catch (err: any) {
    if (err.message?.includes('not found') || err.message?.includes('belong to you')) {
      sendError(res, err.message, 404);
    } else {
      next(err);
    }
  }
}

export async function explainValidation(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const val = await validationService.getValidationById(userId, id);
    if (!val) {
      sendError(res, 'Validation record not found.', 404);
      return;
    }

    const explanation = await generateValidationExplanation(val.results, val.documents || []);
    sendSuccess(res, explanation, 'AI audit explanation generated');
  } catch (err) {
    next(err);
  }
}

export async function getValidations(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const list = await validationService.getUserValidations(userId);
    sendSuccess(res, { validations: list, count: list.length });
  } catch (err) {
    next(err);
  }
}

export async function getValidationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.user!.id;
    const id = req.params.id as string;

    const val = await validationService.getValidationById(userId, id);
    if (!val) {
      sendError(res, 'Validation record not found.', 404);
      return;
    }

    sendSuccess(res, { validation: val });
  } catch (err) {
    next(err);
  }
}

export default {
  compareDocuments,
  explainValidation,
  getValidations,
  getValidationById,
};
