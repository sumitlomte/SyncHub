import express from "express";
import * as messageController from "../controllers/messageController";
import { authMiddleware } from "../middleware/authenMiddleware";
import { validate } from "../middleware/validate";
import {
  messageIdParamsSchema,
  projectIdParamsSchema,
} from "../dto/common.dto";
import { createMessageSchema } from "../dto/message.dto";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(createMessageSchema),
  messageController.saveMessage,
);
router.get(
  "/:projectId/messagesForProject",
  authMiddleware,
  validate(projectIdParamsSchema),
  messageController.getProjectMessages,
);
router.get(
  "/:messageId",
  authMiddleware,
  validate(messageIdParamsSchema),
  messageController.getMessage,
);

export default router;
