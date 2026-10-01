import { Router } from 'express';
import {
  compareDocuments,
  getValidations,
  getValidation,
} from '../controllers/validationController.js';
import authenticate from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { compareRequestSchema } from '../schemas/validation.schemas.js';

const router = Router();

router.use(authenticate);

router.post('/compare', validateBody(compareRequestSchema), compareDocuments);
router.get('/', getValidations);
router.get('/:id', getValidation);

export default router;
