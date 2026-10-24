import { Router } from "express";
import { addTeamMembers, getTeamMembers, removeTeamMembers } from "../controllers/teamController";
import { authMiddleware } from "../middleware/authenMiddleware";

const router = Router();
router.post("/:projectId/addTeamMembers", authMiddleware, addTeamMembers);
router.get("/:projectId/teamMembers", authMiddleware, getTeamMembers);
router.post("/:projectId/removeTeamMembers", authMiddleware, removeTeamMembers);

export default router;

