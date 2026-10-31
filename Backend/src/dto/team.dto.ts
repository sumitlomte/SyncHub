import { z } from "zod";
import type { UserDTO } from "./user.dto";

const teamMembersRequestSchema = z.object({
  userIds: z.array(z.string().trim().min(1)).min(1),
});

export const addTeamMembersSchema = z.object({
  body: teamMembersRequestSchema,
});

export const removeTeamMembersSchema = z.object({
  body: teamMembersRequestSchema,
});

export type TeamMembersRequestDTO = z.infer<
  typeof addTeamMembersSchema
>["body"];

export interface TeamMemberDTO {
  id: string;
  projectId: string;
  userId: string;
  user: UserDTO;
}

export interface TeamMembersMutationResponseDTO {
  count: number;
}

export interface RemoveTeamMembersResponseDTO {
  message: string;
  deletedCount: number;
}
