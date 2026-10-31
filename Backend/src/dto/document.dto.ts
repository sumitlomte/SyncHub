import { z } from "zod";
import type { UserDTO } from "./user.dto";

export const createUploadUrlSchema = z.object({
  body: z.object({
    fileName: z.string().trim().min(1),
    fileType: z.string().trim().min(1),
  }),
});

export const confirmUploadSchema = z.object({
  body: z.object({
    fileName: z.string().trim().min(1),
    fileKey: z.string().trim().min(1),
    fileType: z.string().trim().min(1),
    fileSize: z.number().int().min(0),
  }),
});

export type CreateUploadUrlRequestDTO = z.infer<
  typeof createUploadUrlSchema
>["body"];
export type ConfirmUploadRequestDTO = z.infer<
  typeof confirmUploadSchema
>["body"];

export interface DocumentDTO {
  id: string;
  projectId: string;
  uploadedById: string;
  fileName: string;
  fileKey: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface DocumentWithUploaderDTO extends DocumentDTO {
  uploadedBy: Pick<UserDTO, "id" | "name">;
}

export interface UploadUrlResponseDTO {
  uploadUrl: string;
  fileKey: string;
}

export interface DownloadUrlResponseDTO {
  downloadUrl: string;
}
