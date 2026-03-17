import { Router } from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from "../controllers/projectController";

const router = Router();

router.post("/", createProject);
router.get("/getAllProjectByUserID/:userId", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;