import { Router } from 'express';
import documentController from '../controllers/document.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

// Protect all document routes
router.use(requireAuth);

// Upload single or multiple files
router.post('/upload', upload.array('files', 10), documentController.uploadDocuments);

// List user documents
router.get('/', documentController.getDocuments);

// Get single document details
router.get('/:id', documentController.getDocumentById);

// Trigger AI document classification and structured extraction
router.post('/:id/process', documentController.processDocument);

// Delete document and physical file
router.delete('/:id', documentController.deleteDocument);

export default router;
