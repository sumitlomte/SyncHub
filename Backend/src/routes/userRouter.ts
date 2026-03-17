import { Router } from "express";
import { registerUser, deleteUser, updateUser, loginUser, logoutUser, getAllUsers, assignedProjects } from "../controllers/userController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.post("/logout", logoutUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.get("/assignedProjects/:id", assignedProjects);
export default router;