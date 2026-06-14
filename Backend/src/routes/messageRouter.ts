import express from 'express';
import * as messageController from '../controllers/messageController';
import { authenticateToken } from '../middleware/authenMiddleware';

const router = express.Router();

router.post('/', authenticateToken, messageController.saveMessage);
router.get('/:projectId/messagesForProject', messageController.getProjectMessages);
router.get('/:messageId', authenticateToken, messageController.getMessage);

export default router;