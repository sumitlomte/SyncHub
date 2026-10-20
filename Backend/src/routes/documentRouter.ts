import { Router } from "express";
import {
  getUploadUrl, confirmUpload, listDocuments, getDownloadUrl, deleteDocument,
} from "../controllers/documentController";

const router = Router();

router.post("/:projectId/:userId/upload-url", getUploadUrl);
router.post("/:projectId/:userId/confirm", confirmUpload);
router.get("/:projectId/:userId", listDocuments);
router.get("/download/:documentId/:userId", getDownloadUrl);
router.delete("/:documentId", deleteDocument);

export default router;