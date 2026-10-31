import { z } from "zod";

export type UserRoleDTO = "ADMIN" | "USER";

const userRoleSchema = z.enum(["ADMIN", "USER"]);

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: z.string().min(8),
    role: userRoleSchema,
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: z.string().optional(),
    role: userRoleSchema,
  }),
});

export type RegisterUserRequestDTO = z.infer<typeof registerUserSchema>["body"];
export type LoginUserRequestDTO = z.infer<typeof loginUserSchema>["body"];
export type UpdateUserRequestDTO = z.infer<typeof updateUserSchema>["body"];

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRoleDTO;
}

export interface UserSummaryDTO {
  id: string;
  name: string;
  role: UserRoleDTO;
}

export interface RegisterUserResponseDTO {
  message: string;
  user: Pick<UserDTO, "id">;
}

export interface UserMessageResponseDTO {
  message: string;
}

export interface LoginUserResponseDTO {
  message: string;
  user: UserSummaryDTO;
}
