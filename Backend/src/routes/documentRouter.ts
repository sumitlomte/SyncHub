import { Router } from "express";
import {
  getUploadUrl, confirmUpload, listDocuments, getDownloadUrl, deleteDocument,
} from "../controllers/documentController";
import { authMiddleware } from "../middleware/authenMiddleware";

const router = Router();

router.post("/:projectId/:userId/upload-url", authMiddleware, getUploadUrl);
router.post("/:projectId/:userId/confirm", authMiddleware, confirmUpload);
router.get("/:projectId/:userId", authMiddleware, listDocuments);
router.get("/download/:documentId/:userId", authMiddleware, getDownloadUrl);
router.delete("/:documentId", authMiddleware, deleteDocument);

export default router;