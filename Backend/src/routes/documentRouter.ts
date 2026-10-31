import { Router } from "express";
import {
  getUploadUrl,
  confirmUpload,
  listDocuments,
  getDownloadUrl,
  deleteDocument,
} from "../controllers/documentController";
import { authMiddleware } from "../middleware/authenMiddleware";
import { validate } from "../middleware/validate";
import {
  documentAndUserParamsSchema,
  documentIdParamsSchema,
  projectAndUserParamsSchema,
} from "../dto/common.dto";
import {
  confirmUploadSchema,
  createUploadUrlSchema,
} from "../dto/document.dto";

const router = Router();

router.post(
  "/:projectId/:userId/upload-url",
  authMiddleware,
  validate(projectAndUserParamsSchema.merge(createUploadUrlSchema)),
  getUploadUrl,
);
router.post(
  "/:projectId/:userId/confirm",
  authMiddleware,
  validate(projectAndUserParamsSchema.merge(confirmUploadSchema)),
  confirmUpload,
);
router.get(
  "/:projectId/:userId",
  authMiddleware,
  validate(projectAndUserParamsSchema),
  listDocuments,
);
router.get(
  "/download/:documentId/:userId",
  authMiddleware,
  validate(documentAndUserParamsSchema),
  getDownloadUrl,
);
router.delete(
  "/:documentId",
  authMiddleware,
  validate(documentIdParamsSchema),
  deleteDocument,
);

export default router;
