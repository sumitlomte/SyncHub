import { Router } from "express";
import { addTeamMembers, getTeamMembers, removeTeamMembers } from "../controllers/teamController";

const router = Router();
router.post("/:projectId/addTeamMembers", addTeamMembers);
router.get("/:projectId/teamMembers", getTeamMembers);
router.post("/:projectId/removeTeamMembers", removeTeamMembers);

export default router;

