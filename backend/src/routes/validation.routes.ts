import { Router } from 'express';
import validationController from '../controllers/validation.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Protect all validation routes
router.use(requireAuth);

// Cross-document deterministic comparison
router.post('/compare', validationController.compareDocuments);

// AI Audit Explanation for discrepancies
router.post('/:id/explain', validationController.explainValidation);

// Validation history
router.get('/', validationController.getValidations);

// Single validation record details
router.get('/:id', validationController.getValidationById);

export default router;
