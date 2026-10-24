import express from 'express';
import * as messageController from '../controllers/messageController';
import { authMiddleware } from '../middleware/authenMiddleware';

const router = express.Router();

router.post('/', authMiddleware, messageController.saveMessage);
router.get('/:projectId/messagesForProject', authMiddleware, messageController.getProjectMessages);
router.get('/:messageId', authMiddleware, messageController.getMessage);

export default router;