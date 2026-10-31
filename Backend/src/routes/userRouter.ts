import { Router } from "express";
import {
  registerUser,
  deleteUser,
  updateUser,
  loginUser,
  logoutUser,
  getAllUsers,
  assignedProjects,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authenMiddleware";
import { validate } from "../middleware/validate";
import { idParamsSchema } from "../dto/common.dto";
import {
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../dto/user.dto";

const router = Router();

router.post(
  "/register",
  authMiddleware,
  validate(registerUserSchema),
  registerUser,
);
router.post("/login", validate(loginUserSchema), loginUser);
router.get("/", authMiddleware, getAllUsers);
router.post("/logout", authMiddleware, logoutUser);
router.delete("/:id", authMiddleware, validate(idParamsSchema), deleteUser);
router.put(
  "/:id",
  authMiddleware,
  validate(idParamsSchema.merge(updateUserSchema)),
  updateUser,
);
router.get(
  "/assignedProjects/:id",
  authMiddleware,
  validate(idParamsSchema),
  assignedProjects,
);
export default router;
