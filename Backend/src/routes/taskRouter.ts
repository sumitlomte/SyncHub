import { Router } from "express";
import { createTask, getTasksByProjectId, getTaskById, updateTask, deleteTask} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authenMiddleware";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/getTasksByProjectId/:projectId", authMiddleware, getTasksByProjectId);
router.get("/:id", authMiddleware, getTaskById);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;