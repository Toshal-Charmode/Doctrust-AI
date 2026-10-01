import { Router } from 'express';
import {
  uploadDocuments,
  getDocuments,
  getDocument,
  reprocessDocument,
  removeDocument,
} from '../controllers/documentController.js';
import authenticate from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = Router();

// All document routes require authentication
router.use(authenticate);

router.post('/upload', upload.array('files', 10), uploadDocuments);
router.get('/', getDocuments);
router.get('/:id', getDocument);
router.post('/:id/process', reprocessDocument);
router.delete('/:id', removeDocument);

export default router;
