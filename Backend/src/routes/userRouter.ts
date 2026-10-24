import { Router } from "express";
import { registerUser, deleteUser, updateUser, loginUser, logoutUser, getAllUsers, assignedProjects } from "../controllers/userController";
import { authMiddleware } from "../middleware/authenMiddleware";

const router = Router();

router.post("/register", authMiddleware, registerUser);
router.post("/login", loginUser);
router.get("/", authMiddleware, getAllUsers);
router.post("/logout", authMiddleware, logoutUser);
router.delete("/:id", authMiddleware, deleteUser);
router.put("/:id", authMiddleware, updateUser);
router.get("/assignedProjects/:id", authMiddleware, assignedProjects);
export default router;