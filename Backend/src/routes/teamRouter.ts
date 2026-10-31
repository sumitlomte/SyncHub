import { Router } from "express";
import {
  addTeamMembers,
  getTeamMembers,
  removeTeamMembers,
} from "../controllers/teamController";
import { authMiddleware } from "../middleware/authenMiddleware";
import { validate } from "../middleware/validate";
import { projectIdParamsSchema } from "../dto/common.dto";
import { addTeamMembersSchema, removeTeamMembersSchema } from "../dto/team.dto";

const router = Router();
router.post(
  "/:projectId/addTeamMembers",
  authMiddleware,
  validate(projectIdParamsSchema.merge(addTeamMembersSchema)),
  addTeamMembers,
);
router.get(
  "/:projectId/teamMembers",
  authMiddleware,
  validate(projectIdParamsSchema),
  getTeamMembers,
);
router.post(
  "/:projectId/removeTeamMembers",
  authMiddleware,
  validate(projectIdParamsSchema.merge(removeTeamMembersSchema)),
  removeTeamMembers,
);

export default router;
