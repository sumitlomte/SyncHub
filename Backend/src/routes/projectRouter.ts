import { Router } from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, getProjectsList } from "../controllers/projectController";
import { authMiddleware } from "../middleware/authenMiddleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/getAllProjectByUserID/:userId", authMiddleware, getProjects);
router.get("/getAllProjectsList/:userId", authMiddleware, getProjectsList);
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;