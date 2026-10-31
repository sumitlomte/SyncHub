import { z } from "zod";
import type { UserRoleDTO, UserDTO } from "./user.dto";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    description: z.string(),
    userId: z.string().trim().min(1),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    description: z.string(),
  }),
});

export type CreateProjectRequestDTO = z.infer<
  typeof createProjectSchema
>["body"];
export type UpdateProjectRequestDTO = z.infer<
  typeof updateProjectSchema
>["body"];

export interface ProjectDTO {
  id: string;
  title: string;
  description: string;
  userId: string;
}

export interface ProjectTeamMemberDTO {
  id: string;
  name: string;
  email: string;
  role: UserRoleDTO;
}

export interface ProjectDetailDTO {
  id: string;
  title: string;
  teamMember: ProjectTeamMemberDTO[];
}

export interface ProjectListItemDTO {
  id: string;
  title: string;
  teamMembers: Pick<UserDTO, "id" | "name">[];
}

export interface AssignedProjectDTO extends ProjectDTO {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}
