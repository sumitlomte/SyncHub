import { z } from "zod";

export const projectFormSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Project title is required")
    .max(100, "Project title must be no more than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be no more than 500 characters"),
  userId: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
