import { z } from "zod";

export type MessageTypeDTO = "TEXT" | "DOCUMENT";

export const createMessageSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
  }),
});

export type CreateMessageRequestDTO = z.infer<
  typeof createMessageSchema
>["body"];

export interface MessageDocumentDTO {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface MessageUserDTO {
  id: string;
  name: string;
  email?: string;
}

export interface MessageDTO {
  id: string;
  content: string;
  projectId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  type: MessageTypeDTO;
  documentId: string | null;
  user: MessageUserDTO;
  document?: MessageDocumentDTO | null;
}
