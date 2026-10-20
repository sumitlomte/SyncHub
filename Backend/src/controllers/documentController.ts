import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, BUCKET } from "../lib/s3";
import { prisma } from "../lib/prisma";
import { getIO } from "../lib/socket";

// Step 1: client asks for a presigned upload URL
export const getUploadUrl = async (req: Request, res: Response) => {
  const { projectId, userId } = req.params;
  const { fileName, fileType } = req.body;

  if (typeof projectId !== "string" || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid project or user ID" });
  }

  const member = await prisma.teamMember.findFirst({ where: { projectId, userId } });
  if (!member) return res.status(403).json({ error: "Not a project member" });

  const fileKey = `projects/${projectId}/${randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min

  res.json({ uploadUrl, fileKey });
};

// Step 2: client confirms after successful S3 upload, we save metadata
export const confirmUpload = async (req: Request, res: Response) => {
  const { projectId, userId } = req.params;
  const { fileName, fileKey, fileType, fileSize } = req.body;

  if (typeof projectId !== "string" || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid project or user ID" });
  }

  if (
    typeof fileName !== "string" ||
    typeof fileKey !== "string" ||
    !fileKey.startsWith(`projects/${projectId}/`) ||
    typeof fileType !== "string" ||
    typeof fileSize !== "number" ||
    !Number.isInteger(fileSize) ||
    fileSize < 0
  ) {
    return res.status(400).json({ error: "Invalid document details" });
  }

  const member = await prisma.teamMember.findFirst({ where: { projectId, userId } });
  if (!member) return res.status(403).json({ error: "Not a project member" });

  const { doc, message } = await prisma.$transaction(async (tx) => {
    const doc = await tx.document.create({
      data: { projectId, uploadedById: userId, fileName, fileKey, fileType, fileSize },
    });

    const message = await tx.message.create({
      data: {
        content: "",
        projectId,
        userId,
        type: "DOCUMENT",
        documentId: doc.id,
      },
      include: {
        user: { select: { id: true, name: true } },
        document: {
          select: { id: true, fileName: true, fileType: true, fileSize: true },
        },
      },
    });

    return { doc, message };
  });

  try {
    getIO().to(projectId).emit("message-from-server", message);
  } catch (error) {
    console.error("Document saved, but chat broadcast failed:", error);
  }

  res.status(201).json(doc);
};

export const listDocuments = async (req: Request, res: Response) => {
  const { projectId, userId } = req.params;

  if (typeof projectId !== "string" || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid project or user ID" });
  }

  const member = await prisma.teamMember.findFirst({ where: { projectId, userId } });
  if (!member) return res.status(403).json({ error: "Not a project member" });

  const docs = await prisma.document.findMany({
    where: { projectId },
    include: { uploadedBy: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(docs);
};

export const getDownloadUrl = async (req: Request, res: Response) => {
  const { documentId, userId } = req.params;

  if (typeof documentId !== "string" || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid document or user ID" });
  }

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc) return res.status(404).json({ error: "Not found" });

  const member = await prisma.teamMember.findFirst({ where: { projectId: doc.projectId, userId } });
  if (!member) return res.status(403).json({ error: "Not a project member" });

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: doc.fileKey,
    ResponseContentDisposition: `attachment; filename="${doc.fileName}"`,
  });

  const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  res.json({ downloadUrl });
};

export const deleteDocument = async (req: Request, res: Response) => {
  const { documentId, userId } = req.params;

  if (typeof documentId !== "string" || typeof userId !== "string") {
    return res.status(400).json({ error: "Invalid document or user ID" });
  }

  const doc = await prisma.document.findUnique({ where: { id: documentId }, include: { project: true } });
  if (!doc) return res.status(404).json({ error: "Not found" });

  const isOwnerOrUploader = doc.project.userId === userId || doc.uploadedById === userId;
  if (!isOwnerOrUploader) return res.status(403).json({ error: "Not allowed" });

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: doc.fileKey }));
  await prisma.document.delete({ where: { id: documentId } });

  res.status(204).send();
};