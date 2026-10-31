import { z } from "zod";

export const userFormSchema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be no more than 50 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    role: z.enum(["USER", "ADMIN"]),
    password: z.string(),
  })
  .superRefine(({ id, password }, context) => {
    if (!id && password.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password is required",
      });
      return;
    }

    if (password.length === 0) {
      return;
    }

    if (password.length < 8) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters",
      });
    } else if (!/[A-Z]/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must contain an uppercase letter",
      });
    } else if (!/[a-z]/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must contain a lowercase letter",
      });
    } else if (!/[0-9]/.test(password)) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must contain a number",
      });
    }
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
