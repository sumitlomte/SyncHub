import { prisma } from "../lib/prisma";
import type { Request, Response } from 'express';

export const addTeamMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { userIds } = req.body;
    const team = await prisma.teamMember.createMany({
        data: userIds.map((userId: string) => ({
            projectId,
            userId,
        })),
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team',details: (error as Error).message });
  }
};

export const getTeamMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const teamMembers = await prisma.teamMember.findMany({
      where: { projectId: String(projectId) },
      include: { user: true }, 
    });
    res.status(200).json(teamMembers);
  }
    catch (error) {
    res.status(500).json({ error: 'Failed to retrieve team members', details: (error as Error).message });
  }
};

export const removeTeamMembers = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { userIds: rawUserIds } = req.body as { userIds?: string | string[] };
    const userIdsArray: string[] = Array.isArray(rawUserIds)
      ? rawUserIds
      : rawUserIds
      ? rawUserIds.split(',')
      : [];

    const deleted = await prisma.teamMember.deleteMany({
      where: {
        projectId: String(projectId),
        userId: { in: userIdsArray },
      },
    });
    res.status(200).json({ message: 'Team members removed', deletedCount: deleted.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove team members', details: (error as Error).message });
  } 
};



