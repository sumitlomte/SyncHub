import { z } from "zod";

export type TaskStatusDTO = "TODO" | "IN_PROGRESS" | "COMPLETED";

const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    description: z.string(),
    projectId: z.string().trim().min(1),
    assignee: z.string().trim().min(1),
    assignedTo: z.string().trim().min(1),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    description: z.string(),
    assignee: z.string().trim().min(1),
    assignedTo: z.string().trim().min(1),
    status: taskStatusSchema,
    dueDate: z
      .union([z.iso.datetime(), z.iso.date(), z.literal("")])
      .transform((value) => (value === "" ? null : value))
      .nullable()
      .optional(),
  }),
});

export type CreateTaskRequestDTO = z.infer<typeof createTaskSchema>["body"];
export type UpdateTaskRequestDTO = z.infer<typeof updateTaskSchema>["body"];

export interface TaskDTO {
  id: string;
  title: string;
  description: string;
  projectId: string;
  createdAt: string;
  assignee: string;
  assignedUserId: string;
  assignedTo: string;
  updatedAt: string;
  status: TaskStatusDTO;
  dueDate: string | null;
}
