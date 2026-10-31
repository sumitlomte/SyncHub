import { Router } from "express";
import {
  createTask,
  getTasksByProjectId,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authenMiddleware";
import { validate } from "../middleware/validate";
import { idParamsSchema, projectIdParamsSchema } from "../dto/common.dto";
import { createTaskSchema, updateTaskSchema } from "../dto/task.dto";

const router = Router();

router.post("/", authMiddleware, validate(createTaskSchema), createTask);
router.get(
  "/getTasksByProjectId/:projectId",
  authMiddleware,
  validate(projectIdParamsSchema),
  getTasksByProjectId,
);
router.get("/:id", authMiddleware, validate(idParamsSchema), getTaskById);
router.put(
  "/:id",
  authMiddleware,
  validate(idParamsSchema.merge(updateTaskSchema)),
  updateTask,
);
router.delete("/:id", authMiddleware, validate(idParamsSchema), deleteTask);

export default router;
