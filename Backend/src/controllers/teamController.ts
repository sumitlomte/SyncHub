import { prisma } from "../lib/prisma";
import type { Request, Response } from "express";
import type { ApiErrorDTO } from "../dto/common.dto";
import type {
  RemoveTeamMembersResponseDTO,
  TeamMemberDTO,
  TeamMembersMutationResponseDTO,
  TeamMembersRequestDTO,
} from "../dto/team.dto";

type ProjectIdParams = { projectId: string };

export const addTeamMembers = async (
  req: Request<ProjectIdParams, TeamMembersMutationResponseDTO | ApiErrorDTO, TeamMembersRequestDTO>,
  res: Response<TeamMembersMutationResponseDTO | ApiErrorDTO>,
) => {
  try {
    const { projectId } = req.params;
    const { userIds } = req.body;
    const team = await prisma.teamMember.createMany({
        data: userIds.map((userId: string) => ({
            projectId: String(projectId),
            userId,
        })),
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: "Failed to create team", details: (error as Error).message });
  }
};

export const getTeamMembers = async (
  req: Request<ProjectIdParams, TeamMemberDTO[] | ApiErrorDTO>,
  res: Response<TeamMemberDTO[] | ApiErrorDTO>,
) => {
  try {
    const { projectId } = req.params;
    const teamMembers = await prisma.teamMember.findMany({
      where: { projectId: String(projectId) },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    });
    res.status(200).json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve team members", details: (error as Error).message });
  }
};

export const removeTeamMembers = async (
  req: Request<ProjectIdParams, RemoveTeamMembersResponseDTO | ApiErrorDTO, TeamMembersRequestDTO>,
  res: Response<RemoveTeamMembersResponseDTO | ApiErrorDTO>,
) => {
  try {
    const { projectId } = req.params;
    const { userIds } = req.body;

    const deleted = await prisma.teamMember.deleteMany({
      where: {
        projectId: String(projectId),
        userId: { in: userIds },
      },
    });
    res.status(200).json({ message: "Team members removed", deletedCount: deleted.count });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove team members", details: (error as Error).message });
  }
};
