import { Router } from 'express';
import { chat, getChatHistory } from '../controllers/chatController.js';
import authenticate from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { chatRequestSchema } from '../schemas/chat.schemas.js';

const router = Router();

router.use(authenticate);
router.post('/', validateBody(chatRequestSchema), chat);
router.get('/history', getChatHistory);

export default router;
