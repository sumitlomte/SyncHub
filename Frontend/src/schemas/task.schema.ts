import { z } from "zod";

export const taskFormSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(100, "Task title must be no more than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be no more than 500 characters"),
  projectId: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]),
  dueDate: z.union([
    z.literal(""),
    z.iso.date("Enter a valid due date"),
  ]),
  assignedTo: z.string().optional(),
  assignee: z.string().optional(),
  assignedUserId: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
