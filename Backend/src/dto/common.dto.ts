import { z } from "zod";

export interface ApiErrorDTO {
  error: string;
  details?: string;
}

export type HealthResponseDTO =
  | {
      apiCall: string;
      status: "ok";
      db: "connected";
    }
  | {
      apiCall: string;
      status: "error";
      db: "disconnected";
      error: string;
    };

export const idParamsSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
});

export const userIdParamsSchema = z.object({
  params: z.object({ userId: z.string().min(1) }),
});

export const projectIdParamsSchema = z.object({
  params: z.object({ projectId: z.string().min(1) }),
});

export const messageIdParamsSchema = z.object({
  params: z.object({ messageId: z.string().min(1) }),
});

export const projectAndUserParamsSchema = z.object({
  params: z.object({
    projectId: z.string().min(1),
    userId: z.string().min(1),
  }),
});

export const documentAndUserParamsSchema = z.object({
  params: z.object({
    documentId: z.string().min(1),
    userId: z.string().min(1),
  }),
});

export const documentIdParamsSchema = z.object({
  params: z.object({ documentId: z.string().min(1) }),
});
