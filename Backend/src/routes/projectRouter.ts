import { Router } from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsList,
} from "../controllers/projectController";
import { authMiddleware } from "../middleware/authenMiddleware";
import { validate } from "../middleware/validate";
import { idParamsSchema, userIdParamsSchema } from "../dto/common.dto";
import { createProjectSchema, updateProjectSchema } from "../dto/project.dto";

const router = Router();

router.post("/", authMiddleware, validate(createProjectSchema), createProject);
router.get(
  "/getAllProjectByUserID/:userId",
  authMiddleware,
  validate(userIdParamsSchema),
  getProjects,
);
router.get(
  "/getAllProjectsList/:userId",
  authMiddleware,
  validate(userIdParamsSchema),
  getProjectsList,
);
router.get("/:id", authMiddleware, validate(idParamsSchema), getProjectById);
router.put(
  "/:id",
  authMiddleware,
  validate(idParamsSchema.merge(updateProjectSchema)),
  updateProject,
);
router.delete("/:id", authMiddleware, validate(idParamsSchema), deleteProject);

export default router;
